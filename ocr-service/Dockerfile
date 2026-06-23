FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV HOME=/home/user
ENV PATH=/home/user/.local/bin:$PATH

RUN apt-get update \
  && apt-get install -y --no-install-recommends libgomp1 libglib2.0-0 libgl1 \
  && rm -rf /var/lib/apt/lists/* \
  && useradd -m -u 1000 user

USER user
WORKDIR $HOME/app

COPY --chown=user requirements.txt .
RUN python -m pip install --user --upgrade pip \
  && python -m pip install --user -r requirements.txt

COPY --chown=user app.py .

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=180s --retries=3 \
  CMD python -c "import os, urllib.request; urllib.request.urlopen(f'http://127.0.0.1:{os.getenv(\"PORT\", \"8000\")}/health', timeout=3)"

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
