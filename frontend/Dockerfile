FROM node:18-alpine

ENV NODE_ENV=production

COPY . ./app

WORKDIR /app

RUN yarn 

CMD ["/bin/sh","-c","/app/start.sh"]