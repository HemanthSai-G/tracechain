import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "TRACECHAIN")
    TAGLINE: str = os.getenv("TAGLINE", "From Face to Source. From Source to Proof.")
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Web Search Provider Configuration
    SERPAPI_KEY: str = os.getenv("SERPAPI_KEY", "")
    GOOGLE_CSE_KEY: str = os.getenv("GOOGLE_CSE_KEY", "")
    GOOGLE_CX: str = os.getenv("GOOGLE_CX", "")
    DEFAULT_SEARCH_PROVIDER: str = os.getenv("DEFAULT_SEARCH_PROVIDER", "serpapi")
    
    # Stage 02 Two-Pass Pipeline Thresholds
    FACE_CROP_MARGIN: float = float(os.getenv("FACE_CROP_MARGIN", "0.25"))
    FACE_MATCH_THRESHOLD: float = float(os.getenv("FACE_MATCH_THRESHOLD", "0.65"))
    LENS_RESULT_LIMIT: int = int(os.getenv("LENS_RESULT_LIMIT", "10"))
    CANDIDATE_VALIDATION_LIMIT: int = int(os.getenv("CANDIDATE_VALIDATION_LIMIT", "5"))

    # Blockchain Configuration
    EVM_RPC_URL: str = os.getenv("EVM_RPC_URL", "http://127.0.0.1:8545")
    PRIVATE_KEY: str = os.getenv("PRIVATE_KEY", "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d")
    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "")
    CHAIN_ID: int = int(os.getenv("CHAIN_ID", "1337"))
    NETWORK_NAME: str = os.getenv("NETWORK_NAME", "LOCAL EVM TESTNET (PyEVM Provider)")
    
    # Data directory
    DATA_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

settings = Settings()
