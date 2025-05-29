# Usa un'immagine Node ufficiale
FROM node:20

# Installa dipendenze di sistema utili (es. per Expo)
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di progetto
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY . .

# Installa le dipendenze
RUN if [ -f yarn.lock ]; then yarn install; \
    elif [ -f package-lock.json ]; then npm install; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
    else echo "No lockfile found." && exit 1; fi

RUN npm install -g @expo/ngrok@^4.1.0

# Espone la porta Expo
EXPOSE 8081 19000 19001 19002

# Comando di default: avvia Expo
CMD ["npx", "expo", "start", "--tunnel"]