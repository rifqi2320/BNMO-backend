import { Request, Response, NextFunction } from "express";

const CORS = (_: Request, res: Response, next: NextFunction): void => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

export default CORS;
