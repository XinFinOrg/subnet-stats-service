FROM node:18-alpine as builder
RUN apk add --update --no-cache

COPY . ./builder
RUN cd /builder && yarn install && yarn build

# The actual image
FROM node:18-alpine
RUN apk add --update --no-cache

WORKDIR /app
COPY --from=builder /builder/dist /app

ENV NODE_ENV=production

RUN npm install --global serve

EXPOSE 5555

CMD ["/bin/sh","-c","serve -s -l 5555"]