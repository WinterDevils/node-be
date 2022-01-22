FROM node:12.13.0-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser -S app
COPY addressbook/ .
RUN npm install
RUN npm install -g nodemon -y
RUN chown -R app /opt/app
USER app
EXPOSE 3000
CMD [ "nodemon", "npm", "run", "pm2" ]
