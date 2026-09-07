import pytest
from backend.search.provider import search_provider, SerpApiGoogleLensProvider
from backend.search.matcher import candidate_matcher
from backend.models.schemas import SearchCandidate
from backend.config import settings

def test_search_provider_properties():
    assert search_provider.provider_name is not None
    assert search_provider.search_method is not None

def test_serpapi_key_protected_in_logs(caplog):
    assert bool(settings.SERPAPI_KEY) is True
    assert settings.SERPAPI_KEY not in caplog.text

def test_cosine_similarity_calculation():
    vec1 = [1.0, 0.0, 0.0, 0.0]
    vec2 = [1.0, 0.0, 0.0, 0.0]
    vec3 = [0.0, 1.0, 0.0, 0.0]
    
    assert candidate_matcher.cosine_similarity(vec1, vec2) == 1.0
    assert candidate_matcher.cosine_similarity(vec1, vec3) == 0.0

def test_no_fake_visual_similarity_without_media():
    raw_results = [
        {"title": "Open Source Repository", "url": "https://github.com/actor/profile", "snippet": "Official actor media project profile.", "domain": "github.com"}
    ]
    candidates = candidate_matcher.evaluate_candidates(raw_results, query="actor profile", embedding=[0.1]*512)
    
    assert len(candidates) == 1
    assert candidates[0].visual_similarity is None
    assert candidates[0].face_similarity is None
    assert candidates[0].confidence_score > 0.0
    assert candidates[0].category_type == "SOCIAL"
