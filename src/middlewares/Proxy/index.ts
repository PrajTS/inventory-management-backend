import { NextFunction, Request, Response } from "express";

export const authProxy = (request: Request, response: Response, next: NextFunction) => {
    if (request.method === 'GET' && request.url === '/ping') {
        next();
    }
    else if (request.session.user) {
        request.headers.authorization = JSON.stringify(request.session.user);
        next();
    } else {
        response.status(401).end();
    }
}
