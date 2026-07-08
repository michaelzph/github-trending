#!/bin/bash
cd "$(dirname "$0")"
exec venv/bin/python3 -m uvicorn api.main:app --host 127.0.0.1 --port 8000 --log-level info
