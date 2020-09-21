FROM node

WORKDIR /usr/src/city-lens-server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

CMD [ "npm", "start" ]