import { Inventory } from "@dtos/inventory";
import { RowDataPacket } from "mysql2";
import db from "src/post-start/db";

const findAllInventory = async () => {
  const queryString = `select * from inventory`;

  const [rows] = await (await db).execute(queryString);

  const inventoryItems: Inventory[] = [];

  (rows as RowDataPacket[]).forEach((row) => {
    const item = {
      id: row.id,
      name: row.name,
      price: row.price,
      quantity: row.quantity,
    };
    inventoryItems.push(item);
  });
  return inventoryItems;
};

export default findAllInventory;
