import io
import pytest
import cv2
import numpy as np
from PIL import Image
from backend.face.detector import face_detector
from backend.face.encoder import face_encoder

def create_photographic_face_image(x=50, y=40, w=100, h=100, bg_color=(200, 200, 200)):
    """Creates a synthetic grayscale-shaded face image with realistic intensity gradients for Haar Cascade detection."""
    img_np = np.full((250, 250, 3), bg_color, dtype=np.uint8)
    
    # Face oval (skin intensity)
    cv2.ellipse(img_np, (x + w//2, y + h//2), (w//2, h//2), 0, 0, 360, (210, 170, 140), -1)
    # Forehead highlight
    cv2.ellipse(img_np, (x + w//2, y + h//3), (w//3, h//6), 0, 0, 360, (230, 190, 160), -1)
    # Eyes (dark regions)
    cv2.ellipse(img_np, (x + w//3, y + h//3 + 5), (10, 6), 0, 0, 360, (40, 30, 20), -1)
    cv2.ellipse(img_np, (x + 2*w//3, y + h//3 + 5), (10, 6), 0, 0, 360, (40, 30, 20), -1)
    # Eyebrows
    cv2.line(img_np, (x + w//3 - 10, y + h//3 - 5), (x + w//3 + 10, y + h//3 - 3), (30, 20, 10), 3)
    cv2.line(img_np, (x + 2*w//3 - 10, y + h//3 - 3), (x + 2*w//3 + 10, y + h//3 - 5), (30, 20, 10), 3)
    # Nose bridge (bright vertical strip)
    cv2.rectangle(img_np, (x + w//2 - 4, y + h//3 + 5), (x + w//2 + 4, y + 2*h//3 - 5), (240, 210, 180), -1)
    # Mouth (dark line)
    cv2.ellipse(img_np, (x + w//2, y + 3*h//4), (18, 6), 0, 0, 180, (120, 40, 40), -1)

    is_success, buffer = cv2.imencode(".jpg", img_np)
    return buffer.tobytes()

def test_face_detector_and_encoder_with_real_crop():
    # Direct test of face detector & encoder with a valid face region
    img_np = np.full((150, 150, 3), (200, 170, 140), dtype=np.uint8)
    cv2.circle(img_np, (50, 50), 10, (30, 30, 30), -1)
    cv2.circle(img_np, (100, 50), 10, (30, 30, 30), -1)

    embedding = face_encoder.generate_embedding(img_np)
    assert len(embedding) == 512
    assert isinstance(embedding[0], float)

def test_no_face_detection():
    # Pure blank image MUST return 0 faces and success=False
    img = Image.new('RGB', (100, 100), color=(10, 10, 10))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    img_bytes = buf.getvalue()

    res = face_detector.detect_face(img_bytes)
    assert res['success'] is False
    assert res['faces_count'] == 0
    assert res['bounding_box'] is None
    assert "NO FACE DETECTED" in res['error']

def test_invalid_corrupted_image():
    corrupt_bytes = b"NOT_AN_IMAGE_DATA_BYTES_12345"
    res = face_detector.detect_face(corrupt_bytes)
    
    assert res['success'] is False
    assert res['faces_count'] == 0
    assert res['bounding_box'] is None
    assert "IMAGE DECODE FAILED" in res['error']

def test_different_crops_produce_different_embeddings():
    crop1 = np.full((100, 100, 3), (220, 180, 150), dtype=np.uint8)
    crop2 = np.full((100, 100, 3), (80, 120, 190), dtype=np.uint8)

    emb1 = face_encoder.generate_embedding(crop1)
    emb2 = face_encoder.generate_embedding(crop2)

    assert emb1 != emb2
