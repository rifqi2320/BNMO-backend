import { Router } from "express";
import { AsyncRoute, AsyncMiddleware } from "../lib/asyncWrapper";
import AuthMiddleware from "../middleware/authentication";
import TransactionController from "../controller/transactionController";

const UserRouter = Router();
UserRouter.use(AsyncMiddleware(AuthMiddleware(false)));

// Transaction
const TransactionRouter = Router();
TransactionRouter.get(
  "/",
  AsyncRoute(async (req: any, res: any) => {
    await new TransactionController(req, res).getSelfTransactions();
  })
);

TransactionRouter.post(
  "/transfer",
  AsyncRoute(async (req: any, res: any) => {
    await new TransactionController(req, res).transfer();
  })
);
TransactionRouter.post(
  "/request-balance",
  AsyncRoute(async (req: any, res: any) => {
    await new TransactionController(req, res).requestBalance();
  })
);
TransactionRouter.get(
  "/currency",
  AsyncRoute(async (req: any, res: any) => {
    await new TransactionController(req, res).getCurrencyList();
  })
);

UserRouter.use("/transaction", TransactionRouter);

export default UserRouter;
