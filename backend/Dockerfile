FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install bcrypt --platform=linux --save
RUN npm install

COPY . .

EXPOSE 3001
CMD ["node", "server.js"]
