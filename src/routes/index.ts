import { Request, Response, Router } from 'express';
import AuthRouter from './Auth';
import UsersRouter from './Users';
import TeamsRouter from './Teams';

// Init router and path
const router = Router();

// Add sub-routes
router.get('/ping', (req: Request, res: Response) => res.send("pong"));

router.use('/v1/auth', AuthRouter);

router.use('/v1/account', UsersRouter);

router.use('/v1/teams', TeamsRouter);

router.use('/v1/games', TeamsRouter);

router.use('/v1/invites', TeamsRouter);

// Export the base-router
export default router;
