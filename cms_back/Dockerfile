FROM node:latest
WORKDIR /usr/src/cms-back
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run pair
CMD ["npm", "run", "start"]