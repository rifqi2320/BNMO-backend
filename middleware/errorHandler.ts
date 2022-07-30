import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

const ErrorHandler: ErrorRequestHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err.httpCode) {
    res.status(err.httpCode).json({
      message: err.message,
      data: null,
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error : " + err.message,
      data: null,
    });
  }
};

export default ErrorHandler;
