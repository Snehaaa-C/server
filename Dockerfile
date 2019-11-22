FROM node:12
RUN apt-get update && apt-get install -y arduino-mk
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app 
COPY arduino-lib.tar.gz /usr/share/arduino
RUN npm install
COPY . /app
CMD ["npm", "start"]
