import { NextFunction, Request, Response } from "express"
import StatusCodes from 'http-status-codes';

export const authenticatedUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        return next();
    }
    return res.status(StatusCodes.UNAUTHORIZED).end();
}