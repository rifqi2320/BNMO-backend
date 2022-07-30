import { PrismaClient } from "@prisma/client";

class PrismaService {
  client: PrismaClient;
  constructor() {
    this.client = new PrismaClient();
  }

  getClient(): PrismaClient {
    return this.client;
  }

  refreshClient(): void {
    this.client = new PrismaClient();
  }
}

export default new PrismaService();
