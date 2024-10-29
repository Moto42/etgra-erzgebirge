# Dockerfile for building the site
# Has the tools and node_modules stuff preinstalled
# Currently, this must be done localy, and the image pushed to the forgejot image repo

FROM alpine:latest as node_modules
### builds the node modules folder
RUN apk update && apk add npm;
COPY  package.json /app/package.json
COPY  package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install;

FROM alpine:latest
COPY --from=node_modules /app/node_modules /app/node_modules
RUN apk update && apk add curl zip rsync openssh npm git openrc;
## DL cloudflared
RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/bin/cloudflared && chmod 777 /usr/bin/cloudflared;
