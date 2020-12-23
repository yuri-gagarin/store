import { Response } from "express";

type ControllerErrParams = {
  errMessage?: string;
  messages?: string[];
  statusCode?: number;
}
export class GeneralError extends Error {
  public statusCode: number;
  constructor(errMessage: string, statusCode?: number) {
    super(errMessage);
    this.statusCode = statusCode ? statusCode : 500;
  }
};
export class ValidationError extends GeneralError {
  public errorMessages: string[];
  constructor({ errMessage, messages, statusCode }: ControllerErrParams) {
    errMessage = errMessage ? errMessage : "Invalid Input";
    messages = messages ? messages : [ "Seems like you entered something wrond" ];
    statusCode = statusCode ? statusCode : 400;
    super (errMessage, statusCode);
    this.errorMessages = messages;
  } 
};
export class NotFoundError extends GeneralError {
  public errorMessages: string[];
  constructor({ errMessage, messages, statusCode } : ControllerErrParams) {
    errMessage = errMessage ? errMessage : "Not Found";
    messages = messages ? messages : [ "The requested resource was not found" ];
    statusCode = statusCode ? statusCode : 404;
    super(errMessage, statusCode);
    this.errorMessages = messages;
  }
};
export class NotAllowedError extends GeneralError {
  public errorMessages: string[];
  constructor({ errMessage, messages, statusCode } : ControllerErrParams) {
    errMessage = errMessage ? errMessage : "Not Allowed";
    messages = messages ? messages : [ "This operation is not allowed" ];
    statusCode = statusCode ? statusCode : 401;
    super(errMessage, statusCode);
    this.errorMessages = messages;
  }
};
export type ErrorResponse = {
  responseMsg: string;
  errorMessages?: string[]
  error: GeneralError;
};
export type GenControllerError = (ValidationError | NotFoundError | GeneralError) & Error;

export const processErrorResponse = (res: Response<ErrorResponse>, err: GenControllerError, status?: number): Promise<Response> => {
  return Promise.resolve().then(() => {
    if ((err instanceof ValidationError) || (err instanceof NotFoundError) || (err instanceof NotAllowedError)) {
      const { statusCode, errorMessages } = err; 
      return res.status(statusCode).json({
        responseMsg: err.message,
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
      return res.status(status ? status : 500).json({
        responseMsg: "Something went wrong on our side",
        errorMessages: [ (err as Error).message ],
        error: err
      });
    }
  });
};
