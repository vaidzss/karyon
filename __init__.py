"""
Karyon: Autonomous Moving-Target AI Defense Plane & Context Firewall
"""
import sys
from pathlib import Path

# Add project root to sys.path to enable both `import karyon...` and direct submodule imports
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
