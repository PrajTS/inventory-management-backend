import { Inventory } from "@dtos/inventory";
import { OkPacket } from "mysql2";
import db from "src/post-start/db";

const createInventoryItem = async (inventoryItem: Inventory) => {
  const { quantity, name, price } = inventoryItem;
  const queryString =
    "INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)";

  const [result] = await (await db).query(queryString, [name, quantity, price]);
  const insertId = (<OkPacket>result).insertId;

  return insertId;
};

export default createInventoryItem;
