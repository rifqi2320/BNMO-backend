import { PrismaClient, Role } from "@prisma/client";
import { SHA256 } from "crypto-js";
import user from "./user.json";
import transaction from "./transaction.json";

(async () => {
  const prisma = new PrismaClient();
  const admin = await prisma.user.findFirst({
    where: {
      username: "admin",
    },
  });
  if (!admin) {
    const hashedUser = user.map((item) => {
      return {
        ...item,
        role: Role.ADMIN,
        password: SHA256(item.password).toString(),
      };
    });
    await prisma.user.createMany({
      data: hashedUser,
    });
    await prisma.transaction.createMany({
      data: transaction,
    });

    console.log("Seeding Success");
  } else {
    console.log("Database is already seeded");
  }
})();
