# backend/app/config/paths.py
from pathlib import Path

import os
from dotenv import load_dotenv
load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{PROJECT_ROOT / 'app.db'}"
)

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(PROJECT_ROOT / "backend" / "models" / "model.pkl")
)

