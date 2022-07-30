import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import JWTLib from "../lib/jwt";
import PrismaService from "./../service/prisma";
import Err from "./../types/error";
import { User, Role } from "@prisma/client";

const AuthMiddleware: (
  mustAdmin: boolean
) => (req: Request, res: Response, next: NextFunction) => Promise<void> = (
  mustAdmin
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Get Authorization Header
    const { authorization } = req.headers;

    // If Authorization Header is not provided
    if (!authorization) {
      throw new Err.UnauthenticatedError();
    }

    // Get Token from Authorization Header
    const token: string = authorization.split(" ")[1]!;
    try {
      // Verify the token
      const userData = JWTLib.verify(token);
      if (!userData) {
        throw new Err.UnauthenticatedError();
      }

      // Get User from userData
      const user: User = (await PrismaService.getClient().user.findUnique({
        where: {
          id: userData.id,
        },
      })) as User;

      // Check if Admin when necessary
      if (mustAdmin && user.role !== Role.ADMIN) {
        throw new Err.PermissionDeniedError();
      }

      // Check if User is Verified
      if (!mustAdmin && user.isVerified === false) {
        throw new Err.UserNotVerifiedError();
      }

      // Set user to req.user
      res.locals.user = user;

      // go to next
      next();
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        throw new Err.TokenExpiredError();
      }
      if (error instanceof Err.BNMOError) {
        throw error;
      }
      throw new Err.UnauthenticatedError();
    }
  };
};

export default AuthMiddleware;
