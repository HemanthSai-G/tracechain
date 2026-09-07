import json
from typing import Dict, Any, Union
from backend.models.schemas import ContentPayload

def canonicalize_content(content: Union[ContentPayload, Dict[str, Any]]) -> str:
    """
    Construct a deterministic canonical JSON string representation of discovered web content.
    Includes strictly immutable content fields: author, domain, media_sha256, post_id, source_url, text_caption, title.
    Explicitly excludes dynamic execution state: timestamps, processing time, transaction hashes, or runtime metadata.
    Sorts keys alphabetically, removes whitespace, and formats as exact UTF-8 bytes.
    """
    if isinstance(content, ContentPayload):
        raw_dict = content.model_dump()
    else:
        raw_dict = dict(content)
        
    canonical_dict = {
        "author": str(raw_dict.get("author", "")).strip(),
        "domain": str(raw_dict.get("domain", "")).strip().lower(),
        "media_sha256": str(raw_dict.get("media_sha256", "")).strip(),
        "post_id": str(raw_dict.get("post_id", "")).strip(),
        "source_url": str(raw_dict.get("source_url", "")).strip(),
        "text_caption": str(raw_dict.get("text_caption", "")).strip(),
        "title": str(raw_dict.get("title", "")).strip()
    }
    
    # Dump JSON with sort_keys=True and compact separators (no space after commas/colons)
    canonical_json = json.dumps(canonical_dict, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
    return canonical_json
