#!/bin/bash
cd /Users/zhang/claude_proj/github-trending/backend
exec /Users/zhang/claude_proj/github-trending/backend/venv/bin/python3 -m uvicorn api.main:app --host 127.0.0.1 --port 8000 --log-level info
