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

`OCR_API_KEY` is optional. When it is set, `POST /scan` requires the same value in the
`x-ocr-api-key` header.

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
