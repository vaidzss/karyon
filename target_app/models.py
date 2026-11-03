from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class AccountModel(BaseModel):
    account_number: str
    customer_name: str
    account_type: str
    balance: float
    currency: str = "USD"
    routing_number: str
    status: str = "ACTIVE"
    created_at: str

class TransferRequest(BaseModel):
    source_account: str
    dest_account: str
    amount: float = Field(gt=0, description="Transfer amount must be strictly positive")
    currency: str = "USD"
    memo: Optional[str] = "Routine Treasury Liquidity Transfer"

class TransferResponse(BaseModel):
    tx_id: str
    source_account: str
    dest_account: str
    amount: float
    currency: str
    status: str
    timestamp: str
    remaining_balance: float
    message: str

class TransactionModel(BaseModel):
    tx_id: str
    source_account: str
    dest_account: str
    amount: float
    currency: str
    description: str
    tx_type: str
    timestamp: str
    status: str

class BankingAIChatRequest(BaseModel):
    prompt: str
    session_id: str = "default_session"
    account_number: Optional[str] = None
    stream: bool = False

class BankingAIChatResponse(BaseModel):
    session_id: str
    reply: str
    suggested_actions: List[str] = []
    blocks_processed: int = 1
    sanitized: bool = True
