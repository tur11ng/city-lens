FROM node

WORKDIR /usr/src/city-lens-client
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080

CMD [ "npm", "start" ]