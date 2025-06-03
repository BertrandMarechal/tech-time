FROM node:22-alpine

WORKDIR /opt/app
VOLUME /opt/app

EXPOSE 8080

COPY ./docker_run.sh /opt/docker_run.sh
RUN dos2unix /opt/docker_run.sh
RUN chmod +x /opt/docker_run.sh
ENTRYPOINT /opt/docker_run.sh
# COPY package.json .

# RUN npm install

# # COPY . .

# EXPOSE 8080

# CMD [ "npm", "run", "dev" ]