import { NextFunction, Request, Response } from "express";

export const authProxy = (request: Request, response: Response, next: NextFunction) => {
    const initialValue = request.headers.authorization;
    try {
        if (request.session.user) {
            request.headers.authorization = JSON.stringify(request.session.user);
        }
    } catch (e) {
        request.headers.authorization = initialValue;
    }
    next();
}
