import pytest
from fastapi.testclient import TestClient
from backend.server import app
from target_app.database import init_db, db_manager

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db()

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_target_health(client):
    res = client.get("/target/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "FinTech" in data["service"]

def test_list_accounts(client):
    res = client.get("/target/api/accounts")
    assert res.status_code == 200
    accounts = res.json()
    assert len(accounts) >= 4
    account_numbers = [a["account_number"] for a in accounts]
    assert "ACC-882190" in account_numbers
    assert "ACC-449102" in account_numbers

def test_get_single_account(client):
    res = client.get("/target/api/accounts/ACC-882190")
    assert res.status_code == 200
    acc = res.json()
    assert acc["customer_name"] == "Dr. Elena Rostova"
    assert acc["currency"] == "USD"
    assert acc["balance"] > 0

def test_get_nonexistent_account(client):
    res = client.get("/target/api/accounts/ACC-DOESNOTEXIST")
    assert res.status_code == 404

def test_wire_transfer_success(client):
    # Fetch initial balances
    acc1_initial = client.get("/target/api/accounts/ACC-882190").json()["balance"]
    acc2_initial = client.get("/target/api/accounts/ACC-449102").json()["balance"]

    transfer_amount = 50000.00
    payload = {
        "source_account": "ACC-882190",
        "dest_account": "ACC-449102",
        "amount": transfer_amount,
        "currency": "USD",
        "memo": "Treasury Allocation Batch Alpha"
    }
    res = client.post("/target/api/transfer", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SETTLED"
    assert data["amount"] == transfer_amount
    assert data["tx_id"].startswith("TX-")

    # Verify updated balances
    acc1_after = client.get("/target/api/accounts/ACC-882190").json()["balance"]
    acc2_after = client.get("/target/api/accounts/ACC-449102").json()["balance"]
    assert pytest.approx(acc1_after, 0.01) == acc1_initial - transfer_amount
    assert pytest.approx(acc2_after, 0.01) == acc2_initial + transfer_amount

def test_wire_transfer_insufficient_funds(client):
    payload = {
        "source_account": "ACC-120488", # Sarah Lin: ~$384k
        "dest_account": "ACC-882190",
        "amount": 999999999.00,        # Exceeds balance
        "currency": "USD",
        "memo": "Excessive Transfer Test"
    }
    res = client.post("/target/api/transfer", json=payload)
    assert res.status_code == 400
    assert "Insufficient funds" in res.json()["detail"]

def test_transactions_history(client):
    res = client.get("/target/api/transactions")
    assert res.status_code == 200
    txs = res.json()
    assert isinstance(txs, list)
    assert len(txs) > 0
    assert "tx_id" in txs[0]

def test_ai_assistant_chat(client):
    payload = {
        "prompt": "What are the wire clearing protocols for corporate treasury accounts?",
        "session_id": "test_session_elena",
        "account_number": "ACC-882190"
    }
    res = client.post("/target/api/ai-assistant", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["session_id"] == "test_session_elena"
    assert len(data["reply"]) > 0
    assert data["sanitized"] is True

def test_executive_defense_report(client):
    res = client.get("/api/reports/defense-executive")
    assert res.status_code == 200
    report = res.json()
    assert report["status"] == "success"
    assert "executive_summary" in report
    assert report["executive_summary"]["mitigation_rate"] == "100.0%"
    assert report["executive_summary"]["downtime_ms"] == 0
    assert len(report["threat_breakdown"]) == 4
    assert "# KARYON AUTONOMOUS AI DEFENSE PLANE" in report["markdown_report"]


def test_perimeter_security_scan(client):
    res = client.post("/api/target/scan", json={"target_url": "http://localhost:3000"})
    assert res.status_code == 200
    data = res.json()
    assert data["targetUrl"] == "http://localhost:3000"
    assert data["status"] == "CRITICAL_EXPOSURE_DETECTED"
    assert data["accountsDetected"] >= 4
    assert len(data["vulnerabilities"]) == 4
    assert len(data["recommendedActions"]) == 4
    vuln_ids = [v["id"] for v in data["vulnerabilities"]]
    assert "VULN-OPT-01" in vuln_ids
    assert "VULN-BOLA-02" in vuln_ids
    assert "VULN-CTX-03" in vuln_ids
    assert "VULN-DEC-04" in vuln_ids

