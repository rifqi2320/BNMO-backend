const LoginReqBodySchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 1,
      maxLength: 20,
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 20,
    },
  },
  required: ["username", "password"],
};
const RegisterReqBodySchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 1,
      maxLength: 20,
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 20,
    },
  },
  required: ["username", "password"],
};

const TransferReqBodySchema = {
  type: "object",
  properties: {
    to: {
      type: "string",
    },
    amount: {
      type: "number",
    },
    description: {
      type: "string",
    },
  },
  required: ["to", "amount"],
};
const RequestBalanceReqBodySchema = {
  type: "object",
  properties: {
    amount: {
      type: "number",
    },
  },
  required: ["amount"],
};

export default {
  LoginReqBodySchema,
  RegisterReqBodySchema,
  TransferReqBodySchema,
  RequestBalanceReqBodySchema,
};
