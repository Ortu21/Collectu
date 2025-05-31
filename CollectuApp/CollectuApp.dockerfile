# Usa un'immagine Node ufficiale
FROM node:20

# Installa dipendenze di sistema utili (es. per Expo)
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Installa Expo CLI globalmente
RUN npm install -g @expo/ngrok@^4.1.0 @expo/cli

# Imposta la directory di lavoro
WORKDIR /app

# Copia prima solo i file di dipendenze per ottimizzare la cache Docker
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Installa le dipendenze
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    else echo "No lockfile found." && exit 1; fi

# Copia tutti i file del progetto (incluso .env)
COPY . .

# Espone le porte Expo
EXPOSE 8081 19000 19001 19002

# Comando di default: avvia Expo
CMD ["npx", "expo", "start", "--tunnel"]