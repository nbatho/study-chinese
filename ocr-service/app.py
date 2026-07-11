import base64
import binascii
import hmac
import os
import tempfile
import traceback
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from paddleocr import PaddleOCR
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel


app = FastAPI(title="Study Chinese OCR Service")

MAX_IMAGE_BYTES = int(os.getenv("OCR_MAX_IMAGE_BYTES", str(5 * 1024 * 1024)))
MAX_IMAGE_PIXELS = int(os.getenv("OCR_MAX_IMAGE_PIXELS", str(12_000_000)))
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


class ScanRequest(BaseModel):
    image: str


def create_ocr() -> PaddleOCR:
    return PaddleOCR(
        lang=os.getenv("OCR_LANG", "ch"),
        text_detection_model_name=os.getenv("OCR_DET_MODEL", "PP-OCRv6_small_det"),
        text_recognition_model_name=os.getenv("OCR_REC_MODEL", "PP-OCRv6_small_rec"),
        device=os.getenv("OCR_DEVICE", "cpu"),
        engine=os.getenv("OCR_ENGINE", "paddle_dynamic"),
        enable_mkldnn=os.getenv("OCR_ENABLE_MKLDNN", "false").lower() == "true",
        use_doc_orientation_classify=False,
        use_doc_unwarping=False,
        use_textline_orientation=False,
    )


ocr = create_ocr()


def decode_image(image: str) -> bytes:
    if not image:
        raise HTTPException(status_code=400, detail="Missing image.")

    _, separator, payload = image.partition(",")
    encoded = payload if separator else image

    try:
        image_bytes = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Invalid base64 image.") from exc

    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image is too large.")

    return image_bytes


def verify_api_key(x_ocr_api_key: str | None) -> None:
    expected_api_key = os.getenv("OCR_API_KEY")
    # Auth is on by default; set OCR_REQUIRE_API_KEY=false explicitly for local dev.
    require_api_key = os.getenv("OCR_REQUIRE_API_KEY", "true").lower() == "true"
    if require_api_key and not expected_api_key:
        raise HTTPException(status_code=500, detail="OCR API key is required but not configured.")
    if expected_api_key and not hmac.compare_digest(x_ocr_api_key or "", expected_api_key):
        raise HTTPException(status_code=401, detail="Invalid OCR API key.")


def normalize_box(box: list[float], width: int, height: int) -> dict[str, float]:
    x1, y1, x2, y2 = box
    image_width = max(width, 1)
    image_height = max(height, 1)

    left = max(0, min(100, (x1 / image_width) * 100))
    top = max(0, min(100, (y1 / image_height) * 100))
    right = max(0, min(100, (x2 / image_width) * 100))
    bottom = max(0, min(100, (y2 / image_height) * 100))

    return {
        "top": top,
        "left": left,
        "width": max(1, right - left),
        "height": max(1, bottom - top),
    }


def as_plain(value: Any) -> Any:
    if hasattr(value, "tolist"):
        return value.tolist()
    if isinstance(value, dict):
        return {key: as_plain(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [as_plain(item) for item in value]
    return value


def result_mapping(page: Any) -> dict[str, Any]:
    if isinstance(page, dict):
        data = page
    elif hasattr(page, "to_dict"):
        data = page.to_dict()
    elif hasattr(page, "res"):
        data = page.res
    else:
        data = {}

    data = as_plain(data)
    if isinstance(data, dict) and isinstance(data.get("res"), dict):
        return data["res"]
    return data if isinstance(data, dict) else {}


def polygon_to_box(polygon: list[Any]) -> list[float] | None:
    points = as_plain(polygon)
    if not points:
        return None

    xs = [float(point[0]) for point in points if len(point) >= 2]
    ys = [float(point[1]) for point in points if len(point) >= 2]
    if not xs or not ys:
        return None

    return [min(xs), min(ys), max(xs), max(ys)]


def extract_regions(results: list[Any], width: int, height: int) -> list[dict[str, Any]]:
    regions = []

    for page in results:
        data = result_mapping(page)
        texts = data.get("rec_texts") or []
        scores = data.get("rec_scores") or []
        boxes = data.get("rec_boxes") or []
        polygons = data.get("rec_polys") or []

        for index, raw_text in enumerate(texts):
            text = str(raw_text or "").strip()
            if not text:
                continue

            raw_box = boxes[index] if index < len(boxes) else None
            if raw_box is None and index < len(polygons):
                raw_box = polygon_to_box(polygons[index])

            if raw_box is None or len(raw_box) < 4:
                continue

            confidence = float(scores[index]) if index < len(scores) else None
            box = normalize_box([float(value) for value in raw_box[:4]], width, height)

            regions.append(
                {
                    "text": text,
                    "confidence": confidence,
                    "box": box,
                }
            )

    return regions


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/scan")
def scan(payload: ScanRequest, x_ocr_api_key: str | None = Header(default=None)) -> dict[str, Any]:
    verify_api_key(x_ocr_api_key)
    image_bytes = decode_image(payload.image)

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as file:
        file.write(image_bytes)
        image_path = file.name

    try:
        try:
            with Image.open(image_path) as image:
                width, height = image.size
        except Image.DecompressionBombError as exc:
            raise HTTPException(status_code=413, detail="Image dimensions are too large.") from exc
        except UnidentifiedImageError as exc:
            raise HTTPException(status_code=400, detail="Invalid image file.") from exc

        if width <= 0 or height <= 0 or width * height > MAX_IMAGE_PIXELS:
            raise HTTPException(status_code=413, detail="Image dimensions are too large.")

        try:
            results = ocr.predict(image_path)
        except Exception as exc:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="OCR processing failed.") from exc

        regions = extract_regions(results, width, height)
        detected_text = " ".join(region["text"] for region in regions)

        return {
            "text": detected_text,
            "regions": regions,
        }
    finally:
        try:
            os.remove(image_path)
        except OSError:
            pass
