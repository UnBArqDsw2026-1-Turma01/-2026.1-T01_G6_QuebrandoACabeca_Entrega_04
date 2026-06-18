# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Define a URL da API (pode ser sobrescrita no docker-compose)
ENV REACT_APP_API_URL=http://localhost:8000

# Expõe a porta do React
EXPOSE 3000

# Inicia o servidor de desenvolvimento
CMD ["npm", "start"]