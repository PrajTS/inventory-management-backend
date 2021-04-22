import { authProxy } from '@middlewares/Proxy';
import { Request, Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = Router();

router.use('/', authProxy,
    createProxyMiddleware({
        target: process.env.USER_MANAGER_MICROSERVICE_URL,
        changeOrigin: true,
        onProxyReq: (proxyReq, req: Request) => {
            if (req?.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        }
    })
);

export default router;
