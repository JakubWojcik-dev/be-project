
FROM node:20 as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build


FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install 

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
