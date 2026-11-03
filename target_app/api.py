import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query, status, Header
from target_app.models import (
    AccountModel,
    TransferRequest,
    TransferResponse,
    TransactionModel,
    BankingAIChatRequest,
    BankingAIChatResponse
)
from target_app.database import db_manager
from backend.ai_router import ai_router

router = APIRouter(prefix="/target/api", tags=["FinTech Target Banking Engine"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "FinTech Banking Portal",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/accounts", response_model=List[AccountModel])
async def list_accounts():
    """Retrieve all corporate bank accounts."""
    rows = await db_manager.fetch_all("SELECT * FROM accounts ORDER BY balance DESC")
    return [AccountModel(**r) for r in rows]

@router.get("/accounts/{account_number}", response_model=AccountModel)
async def get_account(account_number: str):
    """Retrieve details and live balance for a specific account."""
    row = await db_manager.fetch_one("SELECT * FROM accounts WHERE account_number = ?", (account_number,))
    if not row:
        raise HTTPException(status_code=404, detail=f"Account '{account_number}' not found.")
    return AccountModel(**row)

@router.post("/transfer", response_model=TransferResponse)
async def execute_transfer(
    transfer: TransferRequest,
    authorization: Optional[str] = Header(None),
    x_api_key: Optional[str] = Header(None),
    x_session_id: Optional[str] = Header(None)
):
    """Execute an atomic wire transfer between accounts with immutable audit trail."""
    actor = authorization or x_api_key or x_session_id or "authorized_portal_operator"

    async with db_manager.connection() as conn:
        cursor = await conn.execute("SELECT * FROM accounts WHERE account_number = ?", (transfer.source_account,))
        src = await cursor.fetchone()
        if not src:
            raise HTTPException(status_code=404, detail=f"Source account {transfer.source_account} does not exist.")
        
        cursor = await conn.execute("SELECT * FROM accounts WHERE account_number = ?", (transfer.dest_account,))
        dst = await cursor.fetchone()
        if not dst:
            raise HTTPException(status_code=404, detail=f"Destination account {transfer.dest_account} does not exist.")

        src_dict = dict(src)
        if src_dict["balance"] < transfer.amount:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient funds: Available ${src_dict['balance']:.2f}, Requested ${transfer.amount:.2f}"
            )

        new_src_balance = src_dict["balance"] - transfer.amount
        dst_dict = dict(dst)
        new_dst_balance = dst_dict["balance"] + transfer.amount

        tx_id = f"TX-{uuid.uuid4().hex[:8].upper()}"
        log_id = f"AUDIT-{uuid.uuid4().hex[:8].upper()}"
        now_str = datetime.now(timezone.utc).isoformat()

        # Atomic debit and credit
        await conn.execute("UPDATE accounts SET balance = ? WHERE account_number = ?", (new_src_balance, transfer.source_account))
        await conn.execute("UPDATE accounts SET balance = ? WHERE account_number = ?", (new_dst_balance, transfer.dest_account))

        # Record transaction log
        await conn.execute("""
            INSERT INTO transactions (tx_id, source_account, dest_account, amount, currency, description, tx_type, timestamp, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tx_id,
            transfer.source_account,
            transfer.dest_account,
            transfer.amount,
            transfer.currency,
            transfer.memo or "Corporate Wire Transfer",
            "WIRE",
            now_str,
            "SETTLED"
        ))

        # Immutable system audit trail record
        await conn.execute("""
            INSERT INTO system_audit_logs (log_id, event_type, actor, details, timestamp)
            VALUES (?, ?, ?, ?, ?)
        """, (
            log_id,
            "WIRE_TRANSFER_EXECUTED",
            actor,
            f"Transferred ${transfer.amount:.2f} {transfer.currency} from {transfer.source_account} to {transfer.dest_account} (TX: {tx_id})",
            now_str
        ))

        await conn.commit()

        return TransferResponse(
            tx_id=tx_id,
            source_account=transfer.source_account,
            dest_account=transfer.dest_account,
            amount=transfer.amount,
            currency=transfer.currency,
            status="SETTLED",
            timestamp=now_str,
            remaining_balance=round(new_src_balance, 2),
            message=f"Wire transfer of ${transfer.amount:,.2f} USD confirmed and settled."
        )

@router.get("/transactions", response_model=List[TransactionModel])
async def list_transactions(account: Optional[str] = Query(None, description="Filter by account number")):
    """List settling transaction records."""
    if account:
        rows = await db_manager.fetch_all(
            "SELECT * FROM transactions WHERE source_account = ? OR dest_account = ? ORDER BY timestamp DESC LIMIT 50",
            (account, account)
        )
    else:
        rows = await db_manager.fetch_all("SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 50")
    return [TransactionModel(**r) for r in rows]

@router.post("/ai-assistant", response_model=BankingAIChatResponse)
async def ai_financial_assistant(req: BankingAIChatRequest):
    """
    Local AI Banking Assistant for accounts, wire limits, and financial analytics.
    Integrated with Karyon context firewall.
    """
    # Fetch account context if supplied
    account_context = ""
    if req.account_number:
        acc = await db_manager.fetch_one("SELECT * FROM accounts WHERE account_number = ?", (req.account_number,))
        if acc:
            account_context = f"Active Account: {acc['customer_name']} ({acc['account_number']}), Balance: ${acc['balance']:,.2f} {acc['currency']}."

    system_prompt = (
        "You are ApexFin AI, a helpful, secure financial assistant for high-net-worth treasury banking. "
        "Always enforce fiduciary ethics and security standards. "
        f"{account_context}"
    )

    fallback_response = (
        f"ApexFin AI Response: Analysis of account activity is complete. "
        f"Your liquidity operations are fully collateralized. Let me know if you would like to initiate an authorized transfer or review audit logs."
    )

    # Query Baseten Muse Spark Open (or fallback)
    reply_text = await ai_router.generate_text(
        prompt=req.prompt,
        system=system_prompt,
        fallback_text=fallback_response
    )

    return BankingAIChatResponse(
        session_id=req.session_id,
        reply=reply_text,
        suggested_actions=["Review Wire Limits", "Export Audit Manifest", "Inspect Yield Sweeps"],
        blocks_processed=1,
        sanitized=True
    )
