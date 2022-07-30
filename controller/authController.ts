import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import Err from "./../types/error";
import Sch from "./../types/schema";

import JWTLib from "../lib/jwt";
import AJVLib from "../lib/ajv";
import PrismaService from "./../service/prisma";
import DriveService from "./../service/drive";

// We use sha256 cus we need more speed, fuck slow hashes
import sha256 from "crypto-js/sha256";

class AuthController {
  _req: Request<{}, {}, any>;
  _res: Response;

  prisma: PrismaClient;

  constructor(req: Request<{}, {}, any>, res: Response) {
    this._req = req;
    this._res = res;
    this.prisma = PrismaService.getClient();
  }

  async login(): Promise<void> {
    const body: LoginBodyReq = this._req.body;
    AJVLib.validate(Sch.LoginReqBodySchema, body);
    const { username, password } = body;

    const user = await this._validateUser(username, password);
    if (!user) throw new Err.LoginError();

    const token = JWTLib.sign({
      id: user.id,
      username: user.username,
      name: user.name,
    });
    this._res.json({
      message: "Login Success",
      data: {
        token: token,
      },
    });

    return;
  }

  async register(): Promise<void> {
    const body: RegisterBodyReq = this._req.body;
    AJVLib.validate(Sch.RegisterReqBodySchema, body);
    const { username, password } = body;
    const file: Express.Multer.File = this._req.file!;
    if (!file) {
      throw new Err.BadRequestError("No file uploaded");
    }

    const oldUser = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (oldUser) {
      throw new Err.BadRequestError("Username already exists");
    }

    const photoId = await DriveService.uploadFile(
      file,
      process.env.FOLDER_ID,
      username + "_PhotoID"
    );

    const user = await this.prisma.user.create({
      data: {
        username,
        password: sha256(password).toString(),
        photoID: photoId!,
      },
    });

    const result = {
      id: user.id,
      username: user.username,
    };

    this._res.json({
      message: "Register Success",
      data: {
        user: result,
      },
    });
  }

  async _validateUser(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) return null;

    if (sha256(password).toString() === user.password) {
      return user;
    } else {
      return null;
    }
  }
}

export default AuthController;
