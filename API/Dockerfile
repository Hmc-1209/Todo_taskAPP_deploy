FROM python:3.11-alpine

WORKDIR /app

COPY requirements.txt /app

RUN pip install -r requirements.txt

COPY . /app

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]