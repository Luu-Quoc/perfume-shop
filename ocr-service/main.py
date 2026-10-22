
from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
from paddleocr import PaddleOCR
import fitz
import io
import numpy as np
from PIL import Image

app = FastAPI(
    title="QUOC PERFUME OCR API",
    description="Dich vu doc hoa don ban hang",
    version="1.0.0"
)

MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_PDF_PAGES = 20

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png"}
ALLOWED_TYPES = ALLOWED_IMAGE_TYPES | {"application/pdf"}

# Khoi tao OCR mot lan khi ung dung khoi dong
ocr_engine = PaddleOCR(
    lang="vi",
    use_textline_orientation=True
)


def recognize_image(image: Image.Image) -> list[str]:
    """Nhan dien chu tu mot anh PIL."""
    image = image.convert("RGB")
    image_array = np.array(image)

    results = ocr_engine.predict(image_array)
    texts = []

    for result in results:
        data = result.json
        if callable(data):
            data = data()

        # PaddleOCR 3.x tra ket qua trong data['res']
        if isinstance(data, dict):
            data = data.get("res", data)

        if isinstance(data, dict):
            texts.extend(
                text.strip()
                for text in data.get("rec_texts", [])
                if isinstance(text, str) and text.strip()
            )

    return texts


@app.get("/")
def home():
    return {
        "message": "QUOC PERFUME OCR API dang hoat dong"
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/ocr/preview")
async def preview_invoice(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Chi chap nhan JPG, PNG hoac PDF"
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="File rong"
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File vuot qua gioi han 10 MB"
        )

    try:
        all_texts = []
        page_count = 1

        if file.content_type == "application/pdf":
            with fitz.open(stream=content, filetype="pdf") as pdf:
                page_count = pdf.page_count

                if page_count == 0:
                    raise HTTPException(
                        status_code=400,
                        detail="PDF khong co trang"
                    )

                if page_count > MAX_PDF_PAGES:
                    raise HTTPException(
                        status_code=413,
                        detail="PDF vuot qua gioi han 20 trang"
                    )

                for page in pdf:
                    # Uu tien doc van ban co san trong PDF
                    page_text = page.get_text().strip()

                    if page_text:
                        all_texts.extend(
                            line.strip()
                            for line in page_text.splitlines()
                            if line.strip()
                        )
                    else:
                        # Neu la trang scan, render thanh anh va OCR
                        pix = page.get_pixmap(
                            matrix=fitz.Matrix(2, 2),
                            alpha=False
                        )
                        image = Image.open(
                            io.BytesIO(pix.tobytes("png"))
                        )
                        all_texts.extend(recognize_image(image))

            file_type = "pdf"

        else:
            image = Image.open(io.BytesIO(content))
            image.verify()

            # Mo lai anh sau verify de xu ly OCR
            image = Image.open(io.BytesIO(content))
            all_texts = recognize_image(image)
            file_type = "image"

        raw_text = "\n".join(all_texts)

        return {
            "file_name": file.filename,
            "file_type": file_type,
            "page_count": page_count if file_type == "pdf" else None,
            "text_extracted": bool(raw_text.strip()),
            "raw_text": raw_text,
            "items": all_texts,
            "message": (
                "Da nhan dien van ban"
                if raw_text.strip()
                else "Khong nhan dien duoc chu; hay thu anh ro hon"
            )
        }

    except HTTPException:
        raise
    except (fitz.FileDataError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="File khong hop le hoac khong doc duoc"
        )
    except Exception as exc:
        print(f"OCR error: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Xu ly OCR that bai; hay kiem tra log cua server"
        )
