import type { NextFunction, Request, Response } from "express";

type AsynControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) => Promise<any>;

export const asyncHandler =
  (controller: AsynControllerType): AsynControllerType =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
