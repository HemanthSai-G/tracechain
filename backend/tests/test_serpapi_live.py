import pytest
import requests
import cv2
import numpy as np
from backend.config import settings

def test_serpapi_authoritative_flow():
    """
    Direct smoke test for SerpApi Authoritative Flow:
    1. Read SERPAPI_KEY from environment
    2. Upload test image bytes to https://serpapi.com/image
    3. Extract image_id
    4. Call https://serpapi.com/search with engine=google_lens&image_id=...&type=visual_matches
    5. Verify exact_matches and visual_matches
    """
    assert bool(settings.SERPAPI_KEY) is True, "SERPAPI_KEY must be configured in .env"
    
    # 1. Generate test image bytes (<= 500 KB)
    img_np = np.full((300, 300, 3), (180, 140, 100), dtype=np.uint8)
    cv2.circle(img_np, (150, 120), 40, (40, 30, 20), -1)
    is_success, buf = cv2.imencode('.jpg', img_np)
    assert is_success is True
    
    img_bytes = buf.tobytes()
    assert len(img_bytes) <= 500 * 1024, "Image must be <= 500 KB"
    
    # 2. Upload image to https://serpapi.com/image
    files = {'image': ('test_subject.jpg', img_bytes, 'image/jpeg')}
    data = {'api_key': settings.SERPAPI_KEY}
    
    up_resp = requests.post("https://serpapi.com/image", files=files, data=data, timeout=12)
    assert up_resp.status_code == 200, f"SerpApi upload failed with status {up_resp.status_code}"
    
    up_json = up_resp.json()
    assert "image_id" in up_json, "SerpApi response missing image_id"
    image_id = up_json["image_id"]
    assert image_id and len(image_id) > 10
    
    # 3. Call Google Lens via SerpApi using image_id
    lens_url = f"https://serpapi.com/search.json?engine=google_lens&image_id={image_id}&type=visual_matches&api_key={settings.SERPAPI_KEY}"
    lens_resp = requests.get(lens_url, timeout=15)
    assert lens_resp.status_code == 200, f"Google Lens request failed with status {lens_resp.status_code}"
    
    lens_json = lens_resp.json()
    assert "visual_matches" in lens_json or "exact_matches" in lens_json
    matches = lens_json.get("visual_matches", []) + lens_json.get("exact_matches", [])
    assert len(matches) > 0, "Google Lens returned zero matches"
    
    # Safe diagnostic prints (NEVER print API key or full image_id)
    print(f"\n[SERPAPI SMOKE TEST SUCCESS]")
    print(f"  Upload HTTP status: {up_resp.status_code}")
    print(f"  Image ID Prefix: {image_id[:6]}...")
    print(f"  Google Lens HTTP status: {lens_resp.status_code}")
    print(f"  Visual matches count: {len(lens_json.get('visual_matches', []))}")
    print(f"  Exact matches count: {len(lens_json.get('exact_matches', []))}")
    if matches:
        print(f"  First result title: {matches[0].get('title')}")
        print(f"  First result source: {matches[0].get('source')}")
        print(f"  First result URL: {matches[0].get('link')}")

if __name__ == "__main__":
    test_serpapi_authoritative_flow()
