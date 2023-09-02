FROM python:3.11-buster

WORKDIR /app

COPY requirements.txt /app

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o rustup-init.sh && \
    chmod +x rustup-init.sh && \
    ./rustup-init.sh -y

ENV PATH="/root/.cargo/bin:${PATH}"

RUN rustup toolchain install stable-arm-unknown-linux-gnueabihf && \
    rustup default stable-arm-unknown-linux-gnueabihf

RUN dpkg --add-architecture armhf && \
    apt-get update && \
    apt-get install -y libc6:armhf

RUN pip install --upgrade pip

RUN apt-get update && apt-get install -y gcc qt5-default build-essential libssl-dev libffi-dev

RUN pip install setuptools wheel sip cryptography==3.4.8 && \
    pip install -r requirements.txt

COPY . /app

EXPOSE 8002

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]