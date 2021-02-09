import { authProxy } from '@middlewares/Proxy';
import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = Router();

router.use('/', authProxy,
    createProxyMiddleware({ target: process.env.USER_MGMNT_MICROSERVICE_URL, changeOrigin: true })
);

export default router;
