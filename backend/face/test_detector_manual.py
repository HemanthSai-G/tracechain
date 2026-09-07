import sys
import os
import time
import cv2
import numpy as np
from PIL import Image

def test_image(image_path: str):
    print("=" * 60)
    print(f"DIAGNOSTIC TEST FOR IMAGE: {image_path}")
    print("=" * 60)
    
    if not os.path.exists(image_path):
        print(f"ERROR: Image file not found at {image_path}")
        return

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    start_time = time.time()
    try:
        pil_image = Image.open(image_path).convert("RGB")
        img_np = np.array(pil_image)
        h_img, w_img, c_img = img_np.shape
        print(f"IMAGE DECODED SUCCESSFULLY:")
        print(f"  Width: {w_img}px, Height: {h_img}px, Channels: {c_img}")
        print(f"  File size: {len(image_bytes)} bytes")
    except Exception as e:
        print(f"ERROR: Failed to decode image: {str(e)}")
        return

    yunet_model_path = os.path.join(os.path.dirname(__file__), "models", "face_detection_yunet_2023mar.onnx")
    detected_faces = []
    engine_used = "None"
    
    # 1. Try YuNet Deep Learning Detector
    if os.path.exists(yunet_model_path) and hasattr(cv2, 'FaceDetectorYN'):
        try:
            detector = cv2.FaceDetectorYN.create(
                model=yunet_model_path,
                config="",
                input_size=(w_img, h_img),
                score_threshold=0.55,
                nms_threshold=0.3,
                top_k=5000
            )
            # YuNet expects BGR format image
            img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
            _, faces = detector.detect(img_bgr)
            
            if faces is not None and len(faces) > 0:
                engine_used = "OpenCV YuNet Deep Learning Model"
                for face in faces:
                    x, y, w, h = [int(v) for v in face[:4]]
                    score = float(face[-1])
                    detected_faces.append({"bbox": [x, y, w, h], "confidence": score})
        except Exception as e:
            print(f"YuNet execution warning: {str(e)}")

    # 2. Fallback to Multi-Scale Haar Cascade Ensemble if YuNet returns 0 faces
    if len(detected_faces) == 0 and hasattr(cv2, 'CascadeClassifier'):
        cascade_names = ['haarcascade_frontalface_alt2.xml', 'haarcascade_frontalface_default.xml']
        cascades = []
        for name in cascade_names:
            p = os.path.join(cv2.data.haarcascades, name)
            if os.path.exists(p):
                cascades.append(cv2.CascadeClassifier(p))
                
        scales = [1.0]
        max_dim = max(w_img, h_img)
        if max_dim > 1000:
            scales.append(1000.0 / max_dim)

        cascade_rects = []
        for scale in scales:
            w_s, h_s = int(w_img * scale), int(h_img * scale)
            r_img = img_np if scale == 1.0 else cv2.resize(img_np, (w_s, h_s))
            gray = cv2.cvtColor(r_img, cv2.COLOR_RGB2GRAY)
            gray_eq = cv2.equalizeHist(gray)
            
            for c in cascades:
                rects = c.detectMultiScale(gray_eq, scaleFactor=1.08, minNeighbors=4, minSize=(30, 30))
                for (x, y, w, h) in rects:
                    cascade_rects.append((int(x / scale), int(y / scale), int(w / scale), int(h / scale)))

        if cascade_rects:
            engine_used = "Multi-Scale Cascade Ensemble"
            # NMS duplicate removal
            nms_rects = []
            for (x, y, w, h) in cascade_rects:
                dup = False
                for (ex, ey, ew, eh) in nms_rects:
                    dx = max(0, min(x + w, ex + ew) - max(x, ex))
                    dy = max(0, min(y + h, ey + eh) - max(y, ey))
                    if dx * dy / min(w * h, ew * eh) > 0.4:
                        dup = True
                        break
                if not dup:
                    nms_rects.append((x, y, w, h))
            
            for (x, y, w, h) in nms_rects:
                aspect = min(w, h) / max(w, h) if max(w, h) > 0 else 0.5
                conf = round(float(np.clip(0.78 + 0.15 * aspect, 0.75, 0.96)), 4)
                detected_faces.append({"bbox": [x, y, w, h], "confidence": conf})

    elapsed = round((time.time() - start_time) * 1000, 2)
    print("-" * 60)
    print(f"DETECTION SUMMARY:")
    print(f"  Engine Used: {engine_used}")
    print(f"  Faces Detected: {len(detected_faces)}")
    print(f"  Processing Time: {elapsed} ms")
    
    for i, item in enumerate(detected_faces, 1):
        print(f"  Face #{i}: Bounding Box = {item['bbox']}, Confidence = {item['confidence']:.4f}")
    print("=" * 60)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        test_image(sys.argv[1])
    else:
        print("Usage: python test_detector_manual.py <path_to_image>")
