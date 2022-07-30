// Auth
type LoginBodyReq = {
  username: string;
  password: string;
};
type RegisterBodyReq = {
  username: string;
  password: string;
};

// User
type VerifyUserParamReq = {
  id: string;
};

// Transaction
type TransferBodyReq = {
  to: string;
  amount: number;
  description: string;
};
type RequestBalanceBodyReq = {
  currency: string;
  amount: number;
};

type ApproveRequestBalanceParamReq = {
  id: string;
};
type DeleteTransactionParamReq = {
  id: string;
};
