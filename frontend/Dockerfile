FROM node:18-alpine
ENV NODE_ENV=production

RUN npm install -g yarn

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn run build

RUN yarn global add serve

EXPOSE 5000

CMD ["serve", "-s", "dist", "-l", "5000"]