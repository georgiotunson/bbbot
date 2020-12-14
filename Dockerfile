FROM node:current-alpine3.10

#RUN apt-get update \
    #&& apt-get install -y --no-install-recommends \
        #python3-dev \
        #build-essential \
        #libpq-dev \
    #&& pip install --upgrade pip \
    #&& apt-get clean autoclean \
    #&& apt-get autoremove -y --purge \
    #&& rm -rf \
        #/var/lib/apt/lists/* \
        #/tmp/* \
        #/var/tmp/* \
        #/usr/share/man \
        #/usr/share/doc \
        #/usr/share/doc-base

WORKDIR /app
COPY ./package.json ./app
RUN npm install 

COPY . /app
RUN /bin/chmod +x ./checkAvailForever.sh

#CMD ["pass args to entrypoint here"]
ENTRYPOINT ["checkAvailForever.sh"]
