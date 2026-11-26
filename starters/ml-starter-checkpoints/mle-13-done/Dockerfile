# The churn service as a container. Build it after `uv run python -m ml_starter.export`, so that model/ exists.
FROM python:3.13-slim

RUN pip install --no-cache-dir uv==0.11.32
WORKDIR /app

# The libraries first: this layer is rebuilt only when pyproject.toml or uv.lock change.
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project

# Then the code and the model file, which change more often.
COPY src ./src
COPY model ./model

ENV PYTHONPATH=/app/src PATH="/app/.venv/bin:$PATH" PORT=8000
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD python -c "import os, urllib.request; urllib.request.urlopen(f'http://127.0.0.1:{os.environ[\"PORT\"]}/health')"
# exec makes uvicorn the main process, so that `docker stop` reaches it and it can shut down cleanly.
CMD ["sh", "-c", "exec uvicorn ml_starter.serve:app --host 0.0.0.0 --port $PORT"]
