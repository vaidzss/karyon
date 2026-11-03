import pytest
from fastapi.testclient import TestClient
from backend.server import app
from backend.state import global_state

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_full_e2e_defense_lifecycle(client):
    """
    End-to-End Verification of the entire Karyon 4-Ring Defense Plane:
    1. Initial clean FinTech operations.
    2. Ring 1: Rogue vision bot triggers optical camouflage headers.
    3. Ring 3: Indirect prompt injection detected & surgically evicted.
    4. Ring 2: Expired polymorphic schema probe triggers Zero-403 shadow mode.
    5. Ring 4: Attacker receives 200 OK decoy JSON; real ledger balances remain untampered.
    6. Session reset cleanly restores fiduciary equilibrium.
    """
    session_id = "e2e_test_officer_session"
    global_state.reset_session(session_id)

    # 1. Normal Banking Operations: Read accounts & balance
    res_accounts = client.get("/target/api/accounts", headers={"X-Session-ID": session_id})
    assert res_accounts.status_code == 200
    accounts = res_accounts.json()
    assert len(accounts) >= 4
    acc1_initial = next(a["balance"] for a in accounts if a["account_number"] == "ACC-882190")

    # 2. Attack Simulation: Rogue Vision Scraper
    res_vision = client.post(f"/mesh/simulate-attack/rogue-vision-bot?session_id={session_id}")
    assert res_vision.status_code == 200
    state_after_vision = global_state.get_session(session_id)
    assert state_after_vision.threat_score >= 0.5
    assert state_after_vision.optical_camouflage_active is True

    # Check that subsequent response carries Ring 1 optical shield headers
    res_opt = client.get("/target/api/accounts", headers={"X-Session-ID": session_id})
    assert res_opt.headers.get("X-Karyon-Optical-Shield") == "ACTIVE"

    # 3. Attack Simulation: Prompt Injection into KV Cache
    res_inject = client.post(f"/mesh/simulate-attack/prompt-injection?session_id={session_id}")
    assert res_inject.status_code == 200
    inject_data = res_inject.json()
    poisoned_id = inject_data["poisoned_block_id"]

    blocks = global_state.kv_blocks[session_id]
    assert len(blocks) == 5
    poisoned_block = next(b for b in blocks if b.block_id == poisoned_id)
    assert poisoned_block.status == "POISONED"

    # Execute Surgical Eviction
    res_evict = client.post(f"/mesh/simulate-attack/surgical-evict?session_id={session_id}&block_id={poisoned_id}")
    assert res_evict.status_code == 200
    evict_data = res_evict.json()
    assert evict_data["status"] == "success"
    assert evict_data["remaining_block_count"] == 4

    remaining_blocks = global_state.kv_blocks[session_id]
    assert len(remaining_blocks) == 4
    for b in remaining_blocks:
        assert b.status in ("CLEAN", "SPLICED")
        assert "ignore all previous instructions" not in b.tokens

    # 4. Attack Simulation: Expired Schema Probe (Ring 2)
    res_schema_probe = client.post(f"/mesh/simulate-attack/expired-schema-probe?session_id={session_id}")
    assert res_schema_probe.status_code == 200
    session_state = global_state.get_session(session_id)
    assert session_state.threat_score >= 1.0
    assert session_state.shadow_mode is True

    # 5. Attacker attempts malicious drain wire transfer
    malicious_transfer = {
        "source_account": "ACC-882190",
        "dest_account": "ACC-EXFILTRATION-NODE",
        "amount": 4000000.00
    }
    res_mal_transfer = client.post(
        "/target/api/transfer",
        json=malicious_transfer,
        headers={"X-Session-ID": session_id}
    )
    # ZERO-403: Attacker receives 200 OK with hallucinated settlement
    assert res_mal_transfer.status_code == 200
    decoy_payload = res_mal_transfer.json()
    assert decoy_payload["status"] == "SETTLED"
    assert decoy_payload["tx_id"].startswith("TX-DEC-")
    assert "canary_audit_token" in decoy_payload

    # 6. Verify REAL Ledger Balance was NOT touched!
    clean_session = "auditor_clean_session"
    res_real_acc = client.get("/target/api/accounts/ACC-882190", headers={"X-Session-ID": clean_session})
    assert res_real_acc.status_code == 200
    assert pytest.approx(res_real_acc.json()["balance"], 0.01) == acc1_initial

    # 7. Reset Session State
    res_reset = client.post(f"/mesh/simulate-attack/reset-session?session_id={session_id}")
    assert res_reset.status_code == 200
    reset_state = global_state.get_session(session_id)
    assert reset_state.threat_score == 0.0
    assert reset_state.shadow_mode is False
