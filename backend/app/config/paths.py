from pathlib import Path

import os
from dotenv import load_dotenv
load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[3]

DEV_DATABASE_URL = os.getenv(
    "DEV_DATABASE_URL",
    f"sqlite:///{PROJECT_ROOT / 'app.db'}"
)

PROD_DATABASE_URL = os.getenv(
    "DATABASE_URL"  # Standard environment variable name in production environments
)

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(PROJECT_ROOT / "backend" / "models" / "model.pkl")
)


