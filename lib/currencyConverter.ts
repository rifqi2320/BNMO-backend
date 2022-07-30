import { redisService } from "../service/redis";
import type { RedisService } from "../service/redis";
import Err from "../types/error";
import axios from "axios";

class CurrencyConverter {
  redis: RedisService;
  constructor() {
    this.redis = redisService;
  }

  async getCurrencyList(): Promise<string[]> {
    const exchangeRate = await this.redis.get("exchange_rate");
    if (exchangeRate && exchangeRate["USD"]) {
      const rates = this._parse(exchangeRate);
      return Object.keys(rates);
    } else {
      this.refresh();
      return await this.getCurrencyList();
    }
  }

  async convertFromIDR(to: string, amount: number): Promise<number> {
    await this._checkIntegrity();
    const exchangeRate = await this.redis.get("exchange_rate");
    if (exchangeRate && exchangeRate[to]) {
      const rate: string | undefined = exchangeRate[to];
      if (rate) {
        return amount * parseFloat(rate);
      }
    }
    throw new Err.CurrencyNotFoundError();
  }

  async convertToIDR(from: string, amount: number): Promise<number> {
    await this._checkIntegrity();
    const exchangeRate = await this.redis.get("exchange_rate");
    if (exchangeRate && exchangeRate[from]) {
      const rate: string | undefined = exchangeRate[from];
      if (rate) {
        return amount / parseFloat(rate);
      }
    }
    throw new Err.CurrencyNotFoundError();
  }

  async refresh(): Promise<void> {
    const response: any = await axios
      .get("https://api.apilayer.com/exchangerates_data/latest?base=IDR", {
        headers: {
          apikey: process.env.EXCHANGE_RATE_API_KEY,
        },
      })
      .then((res: any) => res.data);
    if (response.success) {
      const { timestamp, rates } = response;
      this.redis.setString("timestamp", timestamp);
      this.redis.set("exchange_rate", this._stringify(rates));
    } else {
      throw new Err.APIError();
    }
  }

  async _checkIntegrity() {
    const timestamp = await this.redis.getString("timestamp");
    if (timestamp) {
      const now = new Date().getTime();
      const diff = now - parseInt(timestamp);
      // if diff is 24 hours or more, refresh
      if (diff > 86400000) {
        this.refresh();
      }
    } else {
      this.refresh();
    }
  }

  _stringify(obj: { [key: string]: any }): { [key: string]: string } {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        obj[key] = JSON.stringify(element);
      }
    }
    return obj;
  }

  _parse(obj: { [key: string]: string }): { [key: string]: any } {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        const element = obj[key];
        obj[key] = JSON.parse(element!);
      }
    }
    return obj;
  }
}

export default new CurrencyConverter();
