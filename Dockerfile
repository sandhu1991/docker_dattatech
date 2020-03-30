FROM node:10
LABEL maintainer="sandhu.hardilpreet@gamil.com"

# Create a directory for app
RUN rm -rf /usr/src/app*
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./src/package.json /usr/src/app
RUN npm install

COPY ./src /usr/src/app/

CMD ["npm", "run", "start"]

EXPOSE 8000