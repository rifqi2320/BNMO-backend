import { Router } from "express";
import upload from "../middleware/multer";
import AuthController from "./../controller/authController";
import { AsyncRoute } from "./../lib/asyncWrapper";

const PublicRouter = Router();

// Auth
const AuthRouter = Router();
AuthRouter.post(
  "/login",
  AsyncRoute(async (req: any, res: any) => {
    await new AuthController(req, res).login();
  })
);
AuthRouter.post(
  "/register",
  upload.single("photoid"),
  AsyncRoute(async (req: any, res: any) => {
    await new AuthController(req, res).register();
  })
);

PublicRouter.use("/auth", AuthRouter);

export default PublicRouter;
