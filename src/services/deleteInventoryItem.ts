import { OkPacket } from "mysql2";
import db from "src/post-start/db";

const deleteInventoryItem = async (id: string) => {
  const queryString = `delete from inventory where id="${id}"`;

  const [result] = await (await db).execute(queryString);

  return (<OkPacket>result).affectedRows;
};

export default deleteInventoryItem;
