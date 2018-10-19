FROM node:6
MAINTAINER Eyitemi Egbejule


ENV HOME /usr/src/app

RUN mkdir $HOME
WORKDIR $HOME

RUN npm install -g webpack

COPY package*.json ./

RUN npm install

COPY . $HOME

RUN npm run build


EXPOSE 4200

#CMD "ng", "serve" "--host 0.0.0.0 --port 4200"
