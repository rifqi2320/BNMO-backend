import * as redis from "redis";
import { RedisClientType } from "@redis/client";

class RedisService {
  client: RedisClientType;
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL,
    });
    this.client.connect();
    return this;
  }

  setString(key: string, value: string): void {
    this.client.set(key, value);
  }

  getString(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  set(key: string, value: { [key: string]: string }): void {
    for (const [k, v] of Object.entries(value)) {
      this.client.hSet(key, k, v);
    }
  }
  get(key: string): Promise<{ [key: string]: string } | null> {
    return this.client.hGetAll(key);
  }

  clear(): void {
    this.client.flushDb();
  }
}

const redisService = new RedisService();

export { redisService, RedisService };
