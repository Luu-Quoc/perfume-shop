from paddleocr import PaddleOCR

print("Dang khoi tao PaddleOCR...")

ocr = PaddleOCR(
    lang="vi",
    use_textline_orientation=True
)

print("Khoi tao PaddleOCR thanh cong!")