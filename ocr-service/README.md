---
title: Study Chinese OCR Service
colorFrom: red
colorTo: yellow
sdk: docker
app_port: 8000
suggested_hardware: cpu-basic
---

# Study Chinese OCR Service

FastAPI + PaddleOCR service for the Study Chinese app.

## Runtime variables

```text
OCR_LANG=ch
OCR_DET_MODEL=PP-OCRv6_small_det
OCR_REC_MODEL=PP-OCRv6_small_rec
OCR_DEVICE=cpu
OCR_ENGINE=paddle_dynamic
OCR_ENABLE_MKLDNN=false
OCR_API_KEY=replace-with-a-random-secret
```

`OCR_API_KEY` is required by default: the service refuses `POST /scan` until it is set,
and requests must send the same value in the `x-ocr-api-key` header. For local development
without a key, set `OCR_REQUIRE_API_KEY=false` explicitly.

## Endpoints

```text
GET /health
POST /scan
```

`POST /scan` accepts JSON:

```json
{
  "image": "data:image/png;base64,..."
}
```
