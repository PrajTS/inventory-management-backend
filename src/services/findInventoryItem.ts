import { Inventory } from "@dtos/inventory";
import _ from "lodash";
import { RowDataPacket } from "mysql2";
import db from "src/post-start/db";

const findInventory = async (id: string) => {
  const queryString = `select * from inventory where id="${id}"`;

  const [rows] = await (await db).execute(queryString);
  const row = (<RowDataPacket>rows)[0];

  const inventoryItem: Inventory = {
    ...row.id && {id: row.id},
    ...row.name && {name: row.name},
    ...row.price && {price: row.price},
    ...row.quantity && {quantity: row.quantity},
  };

  return inventoryItem;
};

export default findInventory;
