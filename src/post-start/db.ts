import logger from "@shared/Logger";
import Bluebird from "bluebird";
import mysql from "mysql2/promise";

const db = mysql.createConnection({
  host: "sql6.freemysqlhosting.net",
  user: "sql6443437",
  password: "briznvplNr",
  database: "sql6443437",
  Promise: Bluebird,
});

db.then((res) => logger.info("Connected to db"));

export default db;
