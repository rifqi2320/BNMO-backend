import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import Err from "./../types/error";

import PrismaService from "./../service/prisma";

class UserController {
  _req: Request<any, {}, {}>;
  _res: Response;

  prisma: PrismaClient;

  constructor(req: Request<any, {}, {}>, res: Response) {
    this._req = req;
    this._res = res;
    this.prisma = PrismaService.getClient();
  }

  async getSelfData(): Promise<void> {
    const { user } = this._res.locals;
    const userData = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        username: true,
        role: true,
        photoID: true,
        balance: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    this._res.json({
      isError: false,
      message: "Get Self Data Success",
      data: {
        userData,
      },
    });
  }

  async getUsers(): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        role: Role.USER,
      },
      select: {
        id: true,
        username: true,
        role: true,
        photoID: true,
        balance: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    this._res.json({
      isError: false,
      message: "Get Users Success",
      data: {
        users,
      },
    });
  }

  async verifyUser(): Promise<void> {
    const params: VerifyUserParamReq = this._req.params;
    const { id } = params;
    if (!id) throw new Err.BadRequestError();
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          isVerified: true,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          username: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      this._res.json({
        isError: false,
        message: "Verify User Success",
        data: {
          user,
        },
      });
    } catch (error: any) {
      throw new Err.BadRequestError();
    }
  }
}

export default UserController;
