FROM python:3.7.7-slim-buster

ENV PYTHONBUFFERED=1
ENV PYTHONPATH=.

EXPOSE 5000

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python3-dev \
        build-essential \
        libpq-dev \
    && pip install --upgrade pip \
    && apt-get clean autoclean \
    && apt-get autoremove -y --purge \
    && rm -rf \
        /var/lib/apt/lists/* \
        /tmp/* \
        /var/tmp/* \
        /usr/share/man \
        /usr/share/doc \
        /usr/share/doc-base

RUN mkdir app
WORKDIR /app
COPY ./setup.py /app
RUN pip install --no-cache-dir -e .

COPY . /app
COPY ./gunicorn-entrypoint.sh /usr/local/bin/gunicorn-entrypoint.sh
RUN /bin/chmod +x /usr/local/bin/gunicorn-entrypoint.sh

CMD ["-c ./gunicorn.config.py"]
ENTRYPOINT ["gunicorn-entrypoint.sh"]
