FROM node:14

WORKDIR /code
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3030


RUN npx prisma generate
RUN npm run build

