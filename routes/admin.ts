import { Router } from "express";
import TransactionController from "../controller/transactionController";
import UserController from "../controller/userController";
import { AsyncRoute, AsyncMiddleware } from "../lib/asyncWrapper";
import AuthMiddleware from "../middleware/authentication";

const AdminRouter = Router();
AdminRouter.use(AsyncMiddleware(AuthMiddleware(true)));

// User
const UserRouter = Router();
UserRouter.get(
  "/",
  AsyncRoute(async (req: any, res: any) => {
    await new UserController(req, res).getUsers();
  })
);
UserRouter.put(
  "/:id/verify",
  AsyncRoute(async (req: any, res: any) => {
    await new UserController(req, res).verifyUser();
  })
);
AdminRouter.use("/users", UserRouter);

// Transaction (Admin)
const TransactionRouter = Router();
TransactionRouter.get(
  "/",
  AsyncRoute(async (req: any, res: any) => {
    await new TransactionController(req, res).getTransactions();
  })
);
TransactionRouter.post(
  "/:id/approve",
  AsyncRoute(async (req: any, res: any) => {
    await new TransactionController(req, res).approveRequestBalance();
  })
);
TransactionRouter.post(
  "/:id/reject",
  AsyncRoute(async (req: any, res: any) => {
    await new TransactionController(req, res).rejectRequestBalance();
  })
);

AdminRouter.use("/transaction", TransactionRouter);

export default AdminRouter;
