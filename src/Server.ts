import { CONSTANTS } from '@shared/constants';
import logger from '@shared/Logger';
import connectRedis from 'connect-redis';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import session from 'express-session';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import morgan from 'morgan';
import redis from 'redis';
import BaseRouter from './routes';

const app = express();
const { BAD_REQUEST } = StatusCodes;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

const RedisStore = connectRedis(session);
const redisClient = redis.createClient(process.env.REDIS_CONNECTION_STRING as string);

redisClient.on('connect', () => logger.info("Connected to redis"));

declare module "express-session" {
    interface Session {
        user: any;
    }
}

app.use(session({
    name: CONSTANTS.PINBALL,
    secret: process.env.COOKIE_SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
    rolling: true,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: CONSTANTS.COOKIE_MAX_AGE_MILLIS, // session max age in miliseconds
    }
}));

app.use('/', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});


// Export express instance
export default app;
