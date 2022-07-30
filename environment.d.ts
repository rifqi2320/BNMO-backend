declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: number;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      FOLDER_ID: string;
      EXCHANGE_RATE_API_KEY: string;
      REDIS_URL: string;
      GOOGLE_CLIENT_EMAIL: string;
      GOOGLE_PRIVATE_KEY: string;
    }
  }
}

export {};
