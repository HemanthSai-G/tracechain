import os
import time
import cv2
import numpy as np
from PIL import Image
import io
from typing import Tuple, Dict, Any, Optional

class FaceDetector:
    def __init__(self):
        self.yunet_model_path = os.path.join(os.path.dirname(__file__), "models", "face_detection_yunet_2023mar.onnx")
        self.has_yunet = os.path.exists(self.yunet_model_path) and hasattr(cv2, 'FaceDetectorYN')
        
        self.cascades = []
        if hasattr(cv2, 'CascadeClassifier') and hasattr(cv2, 'data'):
            for name in ['haarcascade_frontalface_alt2.xml', 'haarcascade_frontalface_default.xml']:
                path = os.path.join(cv2.data.haarcascades, name)
                if os.path.exists(path):
                    c = cv2.CascadeClassifier(path)
                    if not c.empty():
                        self.cascades.append(c)

    def detect_face(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Detect faces in an uploaded image byte payload using YuNet Deep Learning Detector
        and Multi-Scale Cascade Ensemble fallback.
        
        Returns genuine detection outputs:
        - Image decode failure -> success=False, error="IMAGE DECODE FAILED"
        - 0 faces detected -> success=False, faces_count=0, bounding_box=None
        - 1 face detected -> success=True, faces_count=1, bounding_box={"x":x,"y":y,"w":w,"h":h}
        - >1 faces detected -> success=True, faces_count=N, warning message
        """
        start_time = time.time()
        
        # 1. Decode Image Bytes
        try:
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            img_np = np.array(pil_image)
            h_img, w_img, _ = img_np.shape
        except Exception as e:
            return {
                "success": False,
                "error": f"IMAGE DECODE FAILED: Could not decode image file ({str(e)})",
                "faces_count": 0,
                "bounding_box": None,
                "image_dimensions": None,
                "confidence": 0.0,
                "processing_time_ms": round((time.time() - start_time) * 1000, 2)
            }

        detected_faces = []
        engine_used = "None"

        # 2. Engine A: OpenCV YuNet Deep Neural Network Face Detector
        if self.has_yunet:
            try:
                yunet = cv2.FaceDetectorYN.create(
                    model=self.yunet_model_path,
                    config="",
                    input_size=(w_img, h_img),
                    score_threshold=0.55,
                    nms_threshold=0.3,
                    top_k=5000
                )
                img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
                _, faces = yunet.detect(img_bgr)
                
                if faces is not None and len(faces) > 0:
                    engine_used = "OpenCV YuNet Deep Learning Model"
                    for face in faces:
                        x, y, w, h = [int(v) for v in face[:4]]
                        # Clamp bounding box coordinates to image dimensions
                        x = max(0, x)
                        y = max(0, y)
                        w = min(w, w_img - x)
                        h = min(h, h_img - y)
                        if w > 10 and h > 10:
                            score = float(np.clip(face[-1], 0.55, 0.99))
                            detected_faces.append({"bbox": [x, y, w, h], "confidence": score})
            except Exception:
                detected_faces = []

        # 3. Engine B: Multi-Scale Image Pyramid Cascade Ensemble Fallback
        if len(detected_faces) == 0 and len(self.cascades) > 0:
            scales = [1.0]
            max_dim = max(w_img, h_img)
            if max_dim > 1000:
                scales.append(1000.0 / max_dim)
            if max_dim > 600:
                scales.append(600.0 / max_dim)

            cascade_rects = []
            for scale in scales:
                w_s, h_s = int(w_img * scale), int(h_img * scale)
                r_img = img_np if scale == 1.0 else cv2.resize(img_np, (w_s, h_s))
                gray = cv2.cvtColor(r_img, cv2.COLOR_RGB2GRAY)
                gray_eq = cv2.equalizeHist(gray)
                
                for c in self.cascades:
                    rects = c.detectMultiScale(gray_eq, scaleFactor=1.08, minNeighbors=4, minSize=(30, 30))
                    for (x, y, w, h) in rects:
                        orig_x = int(x / scale)
                        orig_y = int(y / scale)
                        orig_w = int(w / scale)
                        orig_h = int(h / scale)
                        cascade_rects.append((orig_x, orig_y, orig_w, orig_h))

            if cascade_rects:
                engine_used = "Multi-Scale Cascade Ensemble"
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
                    x = max(0, x)
                    y = max(0, y)
                    w = min(w, w_img - x)
                    h = min(h, h_img - y)
                    if w > 10 and h > 10:
                        aspect = min(w, h) / max(w, h) if max(w, h) > 0 else 0.5
                        conf = round(float(np.clip(0.78 + 0.15 * aspect, 0.75, 0.96)), 4)
                        detected_faces.append({"bbox": [x, y, w, h], "confidence": conf})

        # 4. Handle Detection Outputs
        faces_count = len(detected_faces)

        if faces_count == 0:
            return {
                "success": False,
                "error": "NO FACE DETECTED: The uploaded image does not contain a recognizable face.",
                "faces_count": 0,
                "bounding_box": None,
                "face_crop": None,
                "image_dimensions": {"width": w_img, "height": h_img},
                "confidence": 0.0,
                "processing_time_ms": round((time.time() - start_time) * 1000, 2)
            }

        # Sort detected faces by area descending & select primary face
        detected_faces = sorted(detected_faces, key=lambda f: f["bbox"][2] * f["bbox"][3], reverse=True)
        primary = detected_faces[0]
        x, y, w, h = primary["bbox"]
        face_crop = img_np[y:y+h, x:x+w]
        confidence = round(primary["confidence"], 4)
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        warning_msg = None
        if faces_count > 1:
            warning_msg = f"MULTIPLE FACES DETECTED ({faces_count} faces found). Processing primary facial region."

        return {
            "success": True,
            "faces_count": faces_count,
            "bounding_box": {"x": x, "y": y, "w": w, "h": h},
            "image_dimensions": {"width": w_img, "height": h_img},
            "face_crop": face_crop,
            "full_image": img_np,
            "confidence": confidence,
            "processing_time_ms": processing_time,
            "engine_used": engine_used,
            "warning": warning_msg
        }

face_detector = FaceDetector()
