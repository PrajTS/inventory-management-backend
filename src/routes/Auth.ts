import { authProxy } from '@middlewares/Proxy';
import { CONSTANTS } from '@shared/constants';
import logger from '@shared/Logger';
import axios from 'axios';
import { Request, Response, Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import StatusCodes from 'http-status-codes';

const router = Router();
const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { extend = false } = req.query;
        const { userCred, password } = req.body;
        const { data: user } = await axios.post(
            `${process.env.USER_MANAGER_MICROSERVICE_URL as string}/checkCreds`,
            {
                userCred,
                password
            });
        req.session.user = user || {};
        if (extend) {
            req.session.cookie.maxAge = CONSTANTS.COOKIE_MAX_AGE_EXTENDED_MILLIS;
        }
        return res.status(OK).send();
    } catch (e) {
        logger.err(e)
        return res.status(UNAUTHORIZED).send();
    }
});

router.get('/me', (req: Request, res: Response) => {
    if (req.session.user) {
        res.status(OK).end();
    }
    res.status(UNAUTHORIZED).end();
});

router.get('/logout', (req: Request, res: Response) => {
    if (req.session.user) {
        req.session.destroy((err: any) => {
            if (err) {
                res.status(INTERNAL_SERVER_ERROR).send("Unable to logout");
            }
            res.status(OK).end();
        })
    } else {
        res.status(BAD_REQUEST).send("User was not logged it.");
    }
});

router.use('/', authProxy,
    createProxyMiddleware({
        target: process.env.AUTHENTICATOR_MICROSERVICE_URL,
        changeOrigin: true
    })
);

export default router;
