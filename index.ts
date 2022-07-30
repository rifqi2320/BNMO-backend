import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import PublicRouter from "./routes/public";
import AdminRouter from "./routes/admin";
import UserRouter from "./routes/user";
import ErrorHandler from "./middleware/errorHandler";

const app: Express = express();

app.use(express.json());

// Set up routes
app.use(PublicRouter);
app.use("/admin", AdminRouter);
app.use(UserRouter);

const port = process.env.PORT;
app.use(ErrorHandler);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

export default app;
