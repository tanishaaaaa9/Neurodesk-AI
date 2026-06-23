FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Expose to outside via host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
