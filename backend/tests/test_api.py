import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ONLINE"
    assert "version" in data

def test_api_search_endpoint():
    res = client.post("/api/search", json={"query_text": "developer hackathon profile", "max_results": 2})
    assert res.status_code == 200
    data = res.json()
    assert "provider_used" in data
    assert "total_candidates" in data
    assert "execution_steps" in data
