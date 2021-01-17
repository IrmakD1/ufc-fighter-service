FROM node:12.18.1 as distro
WORKDIR /app
COPY ./src ./src
COPY ./server ./server
COPY ./package.json ./
RUN npm i --no-package-lock
ENTRYPOINT ["node", "src/index.js"]
