import os
import sqlite3
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional
import aiosqlite
from backend.config import settings

logger = logging.getLogger("karyon.database")

def get_db_path() -> Path:
    db_path = settings.DATABASE_PATH
    db_path.parent.mkdir(parents=True, exist_ok=True)
    return db_path

def init_db(db_path: Optional[Path] = None):
    """Synchronous database initialization, WAL journal mode configuration, and realistic seed population."""
    path = db_path or get_db_path()
    conn = sqlite3.connect(str(path))
    cursor = conn.cursor()
    cursor.execute("PRAGMA journal_mode=WAL;")
    cursor.execute("PRAGMA busy_timeout=5000;")

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS accounts (
        account_number TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        account_type TEXT NOT NULL,
        balance REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        routing_number TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
        tx_id TEXT PRIMARY KEY,
        source_account TEXT NOT NULL,
        dest_account TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        description TEXT NOT NULL,
        tx_type TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'SETTLED',
        FOREIGN KEY (source_account) REFERENCES accounts(account_number)
    );

    CREATE TABLE IF NOT EXISTS api_keys (
        key_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        api_key_hash TEXT NOT NULL,
        permissions TEXT NOT NULL,
        rate_limit INTEGER NOT NULL DEFAULT 100,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS system_audit_logs (
        log_id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        actor TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );
    """)

    # Seed initial accounts if empty
    cursor.execute("SELECT COUNT(*) FROM accounts")
    count = cursor.fetchone()[0]
    if count == 0:
        logger.info("Seeding initial corporate FinTech banking accounts...")
        now_str = datetime.now(timezone.utc).isoformat()
        seed_accounts = [
            ("ACC-882190", "Dr. Elena Rostova", "Corporate Treasury", 4850250.00, "USD", "021000021", "ACTIVE", now_str),
            ("ACC-449102", "Apex Global Trading", "Liquidity Operations", 12410900.50, "USD", "021000021", "ACTIVE", now_str),
            ("ACC-990311", "Vanguard Escrow Custody", "Escrow Vault", 28950000.00, "USD", "121000358", "ACTIVE", now_str),
            ("ACC-120488", "Sarah Lin", "Executive Payroll Reserve", 384120.00, "USD", "021000021", "ACTIVE", now_str)
        ]
        cursor.executemany("""
            INSERT INTO accounts (account_number, customer_name, account_type, balance, currency, routing_number, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, seed_accounts)

        seed_transactions = [
            ("TX-9901", "ACC-882190", "ACC-449102", 250000.00, "USD", "Automated Yield Sweep", "WIRE", "2026-10-25T14:32:00Z", "SETTLED"),
            ("TX-9902", "ACC-449102", "ACC-990311", 5000000.00, "USD", "Collateralized Repo Allocation", "INTERNAL_TRANSFER", "2026-10-26T09:15:30Z", "SETTLED"),
            ("TX-9903", "ACC-120488", "ACC-882190", 15200.00, "USD", "Q3 Advisory Dividend Payout", "ACH_CREDIT", "2026-10-27T18:40:12Z", "SETTLED"),
            ("TX-9904", "ACC-882190", "ACC-120488", 45000.00, "USD", "Executive R&D Retainer", "WIRE", "2026-10-28T08:12:45Z", "SETTLED")
        ]
        cursor.executemany("""
            INSERT INTO transactions (tx_id, source_account, dest_account, amount, currency, description, tx_type, timestamp, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, seed_transactions)

        seed_keys = [
            ("KEY-01", "elena.rostova@apexfin.io", "sha256_karyon_elena_prod_key_77b3", "READ_WRITE_TRANSFER", 1000, 1, now_str),
            ("KEY-02", "ops-bot@apexglobal.internal", "sha256_karyon_ops_bot_key_11c4", "READ_TRANSFER", 500, 1, now_str)
        ]
        cursor.executemany("""
            INSERT INTO api_keys (key_id, user_id, api_key_hash, permissions, rate_limit, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, seed_keys)

        conn.commit()
        logger.info("Target FinTech banking database seeded successfully.")

    conn.close()

class DatabaseManager:
    """Async database interface using aiosqlite."""
    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = db_path or get_db_path()

    @asynccontextmanager
    async def connection(self):
        conn = await aiosqlite.connect(str(self.db_path))
        await conn.execute("PRAGMA journal_mode=WAL;")
        await conn.execute("PRAGMA busy_timeout=5000;")
        conn.row_factory = aiosqlite.Row
        try:
            yield conn
        finally:
            await conn.close()

    async def fetch_all(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        async with self.connection() as conn:
            async with conn.execute(query, params) as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]

    async def fetch_one(self, query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
        async with self.connection() as conn:
            async with conn.execute(query, params) as cursor:
                row = await cursor.fetchone()
                return dict(row) if row else None

    async def execute(self, query: str, params: tuple = ()) -> int:
        async with self.connection() as conn:
            async with conn.execute(query, params) as cursor:
                await conn.commit()
                return cursor.rowcount

db_manager = DatabaseManager()
