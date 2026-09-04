FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# Use gunicorn in production, fallback to runserver if DEBUG=True
CMD ["sh", "-c", "python manage.py migrate --noinput && if [ \"$DEBUG\" = \"True\" ]; then python manage.py runserver 0.0.0.0:${PORT:-8000}; else gunicorn core.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3; fi"]
