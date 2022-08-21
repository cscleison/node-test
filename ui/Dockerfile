FROM node:16-alpine
ENV NODE_ENV production
ENV PORT 80
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src/ .

EXPOSE $PORT
CMD [ "node", "index.js" ]