import { Response } from "express";

export class GeneralError extends Error {
  public statusCode: number;
  constructor(errMessage: string, statusCode?: number) {
    super(errMessage);
    this.statusCode = statusCode ? statusCode : 500;
  }
};
export class ValidationError extends GeneralError {
  public errorMessages: string[];
  constructor(errMessage: string, messages: string[], statusCode?: number) {
    super (errMessage, (statusCode ? statusCode : 400));
    this.errorMessages = messages;
  } 
};
export class NotFoundError extends GeneralError {
  public errorMessages: string[];
  constructor(errMessage: string, messages: string[], statusCode?: number) {
    super(errMessage, (statusCode ? statusCode : 404));
    this.errorMessages = messages;
  }
};
export class NotAllowedError extends GeneralError {
  public errorMessages: string[];
  constructor(errMessage: string, messages: string[], statuscode?: number) {
    super(errMessage, (statuscode ? statuscode : 401));
    this.errorMessages = messages;
  }
};
export type ErrorResponse = {
  responseMsg: string;
  errorMessages?: string[]
  error: GeneralError;
};
export type GenControllerError = (ValidationError | NotFoundError | GeneralError) & Error;

export const processErrorResponse = (res: Response<ErrorResponse>, err: GenControllerError): Promise<Response> => {
  return Promise.resolve().then(() => {
    if ((err instanceof ValidationError) || (err instanceof NotFoundError) || (err instanceof NotAllowedError)) {
      const { statusCode, errorMessages } = err; 
      return res.status(statusCode).json({
        responseMsg: "Validation error",
        errorMessages: errorMessages,
        error: err
      });
    } else if (err instanceof GeneralError) {
      const { statusCode } = err;
      return res.status(statusCode).json({
        responseMsg: "General Error",
        errorMessages: [ err.message ],
        error: err
      });
    } else {
      return res.status(500).json({
        responseMsg: "Something went wrong on our side",
        errorMessages: [ (err as Error).message ],
        error: err
      });
    }
  });
};
