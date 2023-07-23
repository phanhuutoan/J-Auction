FROM node:18.12.1

WORKDIR /home/app
COPY yarn.lock .
COPY apps/backend/package.json ./apps/backend/package.json
RUN yarn install

COPY . .

CMD [ "yarn", "start:be" ]