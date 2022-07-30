FROM node:14

WORKDIR /code
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3030

ENV PORT=3030
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRE=${JWT_EXPIRE}
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV GOOGLE_PRIVATE_KEY=${GOOGLE_PRIVATE_KEY}
ENV GOOGLE_CLIENT_EMAIL=${GOOGLE_CLIENT_EMAIL}
ENV FOLDER_ID=${FOLDER_ID}
ENV EXCHANGE_RATE_API_KEY=${EXCHANGE_RATE_API_KEY}

RUN npx prisma generate
RUN npm run build