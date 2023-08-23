FROM node:18

# ENV NODE_ENV=production #breaks

COPY . ./app

WORKDIR /app

RUN yarn 

CMD ["/bin/sh","-c","/app/start.sh"]