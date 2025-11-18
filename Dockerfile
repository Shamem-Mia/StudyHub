FROM ghcr.io/puppeteer/puppeteer:24.30.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# switch to root to avoid permission issue
USER root

COPY package*.json ./
RUN npm install

COPY . .

# drop back to normal user
USER pptruser

CMD ["npm", "start"]
