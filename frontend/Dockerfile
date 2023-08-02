FROM node:18-alpine
ENV NODE_ENV=production

RUN npm install -g yarn --force

RUN npm install -g typescript

COPY . ./app

WORKDIR /app

#macos
RUN apk add --update --no-cache python3 g++ make

RUN yarn install

#temp
RUN yarn add -D @types/lodash.debounce 

EXPOSE 5000

CMD ["/bin/sh","-c","/app/start.sh"]