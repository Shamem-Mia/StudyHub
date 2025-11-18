FROM ghcr.io/puppeteer/puppeteer:24.30.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium


WORKDIR /usr/src/app

USER root

# Copy root package.json
COPY package*.json ./

# Install dependencies for backend + frontend
RUN npm install

# Copy all project files
COPY . .

# Build frontend (this uses your script)
RUN npm run build

USER pptruser

# Start backend
CMD ["npm", "run", "start"]
