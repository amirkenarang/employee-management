FROM node:lts-alpine

RUN mkdir -p /usr/src/employee-management

RUN mkdir -p /usr/src/employee-management/temp

RUN apk add tzdata

WORKDIR /usr/src/employee-management

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run"]

###
