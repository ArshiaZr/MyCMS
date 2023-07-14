FROM node:latest
WORKDIR /usr/src/cms_front
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# Execute script for environment variables
COPY entrypoint.sh .
COPY .env.production .
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]