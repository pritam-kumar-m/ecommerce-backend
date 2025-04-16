import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (e.errors) {
        // Custom error handling for Zod errors
        const formattedErrors = e.errors.map((error: any) => ({
          path: error.path.join("."),
          message: `Invalid input for : ${error.message} ${error.path.join(".")}`,
        }));

        res.status(400).json({
          status: "error",
          errors: formattedErrors,
        });
      } else {
        // Handle unexpected errors
        res.status(500).json({
          status: "error",
          message: "An unexpected error occurred.",
        });
      }
    }
  };

export { validate };
