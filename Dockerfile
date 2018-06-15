FROM node:8.5.0
MAINTAINER Kota Miyamoto
WORKDIR /musication
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN npm install express -g
ADD ./ /musication
EXPOSE 3000
CMD ["node", "app.js"]
