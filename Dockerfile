FROM node:9.1.0

WORKDIR /usr/app

COPY package*.json ./

RUN NODE_ENV=development npm install

COPY . ./

EXPOSE 3000

CMD npm start
