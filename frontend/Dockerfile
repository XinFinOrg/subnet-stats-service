FROM node:18-alpine
ENV NODE_ENV=production

RUN npm install -g yarn --force

COPY . ./app

WORKDIR /app

RUN yarn install

RUN yarn run build

RUN yarn global add serve

EXPOSE 5000

CMD ["serve", "-s", "dist", "-l", "5000"]