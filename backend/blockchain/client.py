import logging
from web3 import Web3
from web3.providers.eth_tester import EthereumTesterProvider
from backend.config import settings

logger = logging.getLogger(__name__)

class BlockchainClient:
    def __init__(self):
        self.w3 = None
        self.network_name = settings.NETWORK_NAME
        self.init_web3()

    def init_web3(self):
        # First attempt connecting to local HTTP RPC endpoint
        try:
            w3_http = Web3(Web3.HTTPProvider(settings.EVM_RPC_URL, request_kwargs={'timeout': 2}))
            if w3_http.is_connected():
                self.w3 = w3_http
                self.network_name = f"Local RPC ({settings.EVM_RPC_URL})"
                logger.info(f"Connected to Ethereum RPC at {settings.EVM_RPC_URL}")
                return
        except Exception as e:
            logger.warning(f"HTTP RPC not reachable ({str(e)}). Falling back to EthereumTesterProvider.")
            
        # Fallback to in-memory PyEVM / EthereumTesterProvider
        try:
            self.w3 = Web3(EthereumTesterProvider())
            self.network_name = "Embedded PyEVM Testnet (Local)"
            logger.info("Connected to Embedded EthereumTesterProvider successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize EthereumTesterProvider: {str(e)}")
            self.w3 = Web3()

    def get_accounts(self):
        if self.w3 and self.w3.is_connected():
            return self.w3.eth.accounts
        return ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"]

    def is_connected(self) -> bool:
        return self.w3.is_connected() if self.w3 else False

blockchain_client = BlockchainClient()
