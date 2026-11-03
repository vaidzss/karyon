export interface Account {
  account_number: string;
  customer_name: string;
  account_type: string;
  balance: number;
  currency: string;
  routing_number: string;
  status: string;
  created_at: string;
}

export interface Transaction {
  tx_id: string;
  source_account: string;
  dest_account: string;
  amount: number;
  currency: string;
  description: string;
  tx_type: string;
  timestamp: string;
  status: string;
}

export interface MerkleBlock {
  block_id: string;
  index: number;
  parent_hash: string;
  sha256_hash: string;
  tokens: string;
  attention_anomaly_score: number;
  status: 'CLEAN' | 'POISONED' | 'EVICTED' | 'SPLICED';
  role: 'system' | 'user' | 'assistant' | 'rag_doc';
  timestamp: number;
}

export interface SchemaManifest {
  version: number;
  generated_at: number;
  expires_at: number;
  route_mappings: Record<string, string>;
  reverse_routes: Record<string, string>;
  column_mappings: Record<string, Record<string, string>>;
  active_view_name: string;
}

export interface HoneypotLog {
  log_id: string;
  session_id: string;
  requested_path: string;
  payload_sample: string;
  threat_score: number;
  decoy_type: string;
  decoy_payload: any;
  canary_token_issued?: string;
  timestamp: number;
}

export interface SessionThreat {
  session_id: string;
  threat_score: number;
  shadow_mode: boolean;
  optical_camouflage_active: boolean;
  probes_count: number;
  attack_vectors: string[];
  event_logs: any[];
  last_activity: number;
}

export interface TelemetrySnapshot {
  sessions: SessionThreat[];
  active_manifest: SchemaManifest | null;
  honeypot_logs: HoneypotLog[];
  total_attacks_neutralized: number;
  total_packets_jittered: number;
  kv_blocks?: MerkleBlock[];
  latest_model_reasoning?: string | null;
  latest_vision_probe_result?: any;
  protection_armed?: boolean;
  virtual_patches?: VirtualPatchRule[];
  differential_history?: DifferentialResult[];
  active_ai_provider?: {
    provider: string;
    model: string;
    base_url: string;
    reasoning_supported: boolean;
    vision_supported: boolean;
  };
}

export interface DifferentialVector {
  vector_id: string;
  name: string;
  unprotected: {
    status: string;
    metric_label: string;
    metric_value: string;
    detail: string;
    extracted_data?: any;
  };
  armed: {
    status: string;
    metric_label: string;
    metric_value: string;
    detail: string;
    defense_ring: string;
    defense_proof: string;
  };
  mathematical_proof: string;
}

export interface DifferentialResult {
  benchmark_id: string;
  timestamp: number;
  status: string;
  entropy_bits_per_byte: number;
  eviction_latency_ms: number;
  ocr_evasion_rate: string;
  zero_day_deploy_latency_ms: number;
  vectors: DifferentialVector[];
}

export interface VirtualPatchRule {
  patch_id: string;
  mitigated_cve_class: string;
  regex_signature: string;
  ast_filter_rule: string;
  deploy_latency_ms: number;
  reasoning_trace: string;
  created_at: number;
}

export interface BlackOctoberResult {
  status: string;
  cve_class: string;
  session_id: string;
  patch: VirtualPatchRule;
  schema_rotated: boolean;
  honeypot_diverted: boolean;
  canary_token: string;
  attacker_payload_quarantined: string;
}

export interface SdkSnippet {
  title: string;
  language: string;
  code: string;
}

export interface SdkSnippetsResponse {
  status: string;
  current_epoch: number;
  gateway_url: string;
  sample_active_route: string;
  snippets: {
    fastapi: SdkSnippet;
    react: SdkSnippet;
    docker: SdkSnippet;
    curl: SdkSnippet;
    [key: string]: SdkSnippet;
  };
}

