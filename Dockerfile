FROM node:13.12.0-alpine3.11

COPY . /bot
WORKDIR bot

# install dependencies
RUN npm install

ENTRYPOINT ["npm", "start"]