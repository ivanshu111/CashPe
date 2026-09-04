FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN mkdir -p public/uploads/profile-pictures

EXPOSE 3000

CMD ["node", "src/app.js"]
