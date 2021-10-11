import { ErrorAPIResp } from "@dtos/errorApiResponse";
import { authenticatedUser } from "@middlewares/userAuth";
import createInventoryItem from "@services/createInventoryItem";
import deleteInventoryItem from "@services/deleteInventoryItem";
import findAllInventory from "@services/findAllInventoryItems";
import findInventory from "@services/findInventoryItem";
import logger from "@shared/Logger";
import { Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import _ from "lodash";

const router = Router();
const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND, CREATED } =
  StatusCodes;

router.get("/:id?", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id) {
      const result = await findInventory(id);
      if (_.isEmpty(result)) {
        return res
          .status(NOT_FOUND)
          .json(
            new ErrorAPIResp(
              NOT_FOUND,
              "No item found with the id",
              "Inventory"
            )
          );
      } else {
        return res.status(OK).json({
          inventoryItem: result,
        });
      }
    } else {
      const results = await findAllInventory();
      if (results.length === 0) {
        return res
          .status(NOT_FOUND)
          .json(
            new ErrorAPIResp(
              NOT_FOUND,
              "No items present in the inventory",
              "Inventory"
            )
          );
      } else {
        return res.status(OK).json({
          inventoryItems: results,
        });
      }
    }
  } catch (e) {
    logger.err(e);
    return res
      .status(UNAUTHORIZED)
      .json(new ErrorAPIResp(UNAUTHORIZED, "Incorrect username", "Inventory"));
  }
});

router.post("/", authenticatedUser, async (req: Request, res: Response) => {
  try {
    const item = req.body;
    const newItemIndex = await createInventoryItem(item);
    if (!newItemIndex) {
      throw "";
    }
    return res.status(CREATED).end();
  } catch (e) {
    logger.err(e);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new ErrorAPIResp(INTERNAL_SERVER_ERROR, "Could not insert", "Inventory")
      );
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItemCount = await deleteInventoryItem(id);
    if (!deletedItemCount) {
      return res
        .status(NOT_FOUND)
        .json(
          new ErrorAPIResp(
            INTERNAL_SERVER_ERROR,
            "Item does not exist",
            "Inventory"
          )
        );
    }
    return res.status(OK).end();
  } catch (e) {
    logger.err(e);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new ErrorAPIResp(INTERNAL_SERVER_ERROR, "Could not delete", "Inventory")
      );
  }
});

export default router;
