import { Request, Response, Router } from "express";
import AuthRouter from "./Auth";
import InventoryRouter from "./Inventory";

// Init router and path
const router = Router();

// Add sub-routes
router.get("/ping", (req: Request, res: Response) => res.send("pong"));

router.use("/v1/auth", AuthRouter);

router.use("/v1/inventory", InventoryRouter);

// Export the base-router
export default router;
