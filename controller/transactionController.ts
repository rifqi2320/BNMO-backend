import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Err from "./../types/error";
import Sch from "./../types/schema";

import PrismaService from "../service/prisma";
import AJVLib from "../lib/ajv";
import CurrencyConverter from "../lib/currencyConverter";

class TransactionController {
  _req: Request<any, {}, any>;
  _res: Response;

  prisma: PrismaClient;

  constructor(req: Request<{}, {}, object>, res: Response) {
    this._req = req;
    this._res = res;
    this.prisma = PrismaService.getClient();
  }

  async getSelfTransactions(): Promise<void> {
    const { user } = this._res.locals;

    const transactionsFrom = await this.prisma.transaction.findMany({
      where: {
        from: user.id,
      },
      select: {
        id: true,
        from: true,
        to: true,
        description: true,
        amount: true,
        approved: true,
        approvedAt: true,
        createdAt: true,
      },
    });

    const transactionsTo = await this.prisma.transaction.findMany({
      where: {
        to: user.username,
      },
      select: {
        id: true,
        from: true,
        to: true,
        amount: true,
        approved: true,
        approvedAt: true,
        createdAt: true,
      },
    });
    this._res.json({
      isError: false,
      message: "Get Self Transactions Success",
      data: {
        transactions: [...transactionsFrom, ...transactionsTo],
      },
    });
  }

  async getTransactions(): Promise<void> {
    const transactions = await this.prisma.transaction.findMany({
      select: {
        id: true,
        from: true,
        to: true,
        description: true,
        amount: true,
        approved: true,
        approvedAt: true,
        createdAt: true,
      },
      where: {
        from: null,
      },
    });

    this._res.json({
      isError: false,
      message: "Get Transactions Success",
      data: {
        transactions,
      },
    });
  }

  async transfer(): Promise<void> {
    const body: TransferBodyReq = this._req.body;
    AJVLib.validateRequest(Sch.TransferReqBodySchema, body);
    const { to, amount, description } = body;
    const { user } = this._res.locals;

    const userFrom = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        balance: true,
      },
    });
    if (userFrom!.balance < amount) throw new Err.BalanceNotEnoughError();

    const userTo = await this.prisma.user.findUnique({
      where: {
        username: to,
      },
      select: {
        id: true,
        balance: true,
      },
    });
    if (!userTo) throw new Err.BadRequestError("User not found");

    if (userFrom!.id === userTo!.id)
      throw new Err.BadRequestError("Cannot transfer to yourself");

    const [transaction, _, __] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          from: user.id,
          to,
          amount,
          description,
          approved: true,
        },
      }),
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          balance: user.balance - amount,
        },
      }),
      this.prisma.user.update({
        where: {
          id: userTo.id,
        },
        data: {
          balance: userTo.balance + amount,
        },
      }),
    ]);

    this._res.json({
      isError: false,
      message: "Transfer Success",
      data: {
        transaction,
      },
    });
  }

  async requestBalance(): Promise<void> {
    const body: RequestBalanceBodyReq = this._req.body;
    AJVLib.validateRequest(Sch.RequestBalanceReqBodySchema, body);
    const { amount: oamount, currency } = body;
    const { user } = this._res.locals;

    const userTo = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        username: true,
        balance: true,
      },
    });
    const transactions = await this.prisma.transaction.findMany({
      where: {
        to: user.username,
        approved: false,
      },
    });
    const sumTransactions = transactions.reduce((acc: number, cur: any) => {
      if (cur.amount < 0) {
        return acc + cur.amount;
      }
      return acc;
    }, 0);

    const amount = await CurrencyConverter.convertToIDR(currency, oamount);

    if (amount === 0) throw new Err.BadRequestError("Amount must not be 0");

    if (userTo!.balance + sumTransactions + amount < 0)
      throw new Err.BalanceNotEnoughError();

    const transaction = await this.prisma.transaction.create({
      data: {
        to: user.username,
        description: `Request Balance ${oamount} ${currency}`,
        amount,
        approved: false,
      },
    });

    this._res.json({
      isError: false,
      message: "Request Balance Success",
      data: {
        transaction,
      },
    });
  }

  async rejectRequestBalance(): Promise<void> {
    const param: DeleteTransactionParamReq = this._req.params;
    const { id } = param;
    if (!id) throw new Err.BadRequestError();

    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        approved: true,
      },
    });

    if (!transaction) throw new Err.BadRequestError("Transaction not found");
    if (transaction.approved)
      throw new Err.BadRequestError("Transaction already approved");

    const deletedTransaction = await this.prisma.transaction.delete({
      where: {
        id,
      },
    });

    this._res.json({
      isError: false,
      message: "Delete Transaction Success",
      data: {
        deletedTransaction,
      },
    });
  }

  async approveRequestBalance(): Promise<void> {
    const param: ApproveRequestBalanceParamReq = this._req.params;
    const { id } = param;
    if (!id) throw new Err.BadRequestError();

    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        from: true,
        to: true,
        amount: true,
        approved: true,
      },
    });
    if (!transaction) throw new Err.BadRequestError("Transaction not found");
    if (transaction.approved)
      throw new Err.BadRequestError("Transaction already approved");

    const userTo = await this.prisma.user.findUnique({
      where: {
        username: transaction.to,
      },
      select: {
        id: true,
        balance: true,
      },
    });
    if (!userTo) throw new Err.BadRequestError("User not found");

    const [transactionApproved, _] = await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: {
          id,
        },
        data: {
          approved: true,
          approvedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: {
          id: userTo.id,
        },
        data: {
          balance: userTo.balance + transaction.amount,
        },
      }),
    ]);

    this._res.json({
      isError: false,
      message: "Approve Request Balance Success",
      data: {
        transactionApproved,
      },
    });
  }

  async getCurrencyList(): Promise<void> {
    const currencies = await CurrencyConverter.getCurrencyList();
    this._res.json({
      isError: false,
      message: "Get Currency List Success",
      data: {
        currencies,
      },
    });
  }
}

export default TransactionController;
