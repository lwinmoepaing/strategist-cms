import { Request } from "express";
import { AnyZodObject } from "zod";

export class BadRequest extends Error {
  code = 400;
  constructor(message: string) {
    super(message);

    this.name = "BadRequest";
  }
}

export const validateResource = async <T extends AnyZodObject>(
  schema: T,
  req: Request
) => {
  const parseData = {
    body: req.body,
    query: req.query,
    params: req.params,
  };
  await schema.parseAsync(parseData);
};
