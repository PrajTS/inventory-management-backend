import { Request, Response, Router } from 'express';
import AuthRouter from './Auth';
import UsersRouter from './Users';

// Init router and path
const router = Router();

// Add sub-routes
router.get('/ping', (req: Request, res: Response) => res.send("pong"));

router.use('/v1/auth', AuthRouter);

router.use('/v1/account', UsersRouter);

// Export the base-router
export default router;
