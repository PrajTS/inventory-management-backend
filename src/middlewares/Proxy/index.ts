import { NextFunction, Request, Response } from "express";

export const authProxy = (request: Request, response: Response, next: NextFunction) => {
    const initialValue = request.headers.authorization;
    try {
        request.headers.authorization = JSON.stringify({id: "608952798ee39b75df7f12ed"});
        // TODO Uncomment 8-10 and remove line 6
        // if (request.session.user) {
        //     request.headers.authorization = JSON.stringify(request.session.user);
        // }
    } catch (e) {
        request.headers.authorization = initialValue;
    }
    next();
}
