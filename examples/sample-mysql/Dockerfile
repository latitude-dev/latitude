FROM node:18

WORKDIR /usr/src/app

COPY .latitude/app/package*.json ./

RUN npm install

COPY .latitude/app .

RUN npm run build

EXPOSE 3000

CMD ["node", "build"]

