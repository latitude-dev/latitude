FROM node:18

RUN npm install -g @latitude-data/cli

WORKDIR /usr/src/app

COPY . .

RUN latitude build

EXPOSE 3000

WORKDIR /user/src/app/build

CMD ["node", "build"]

