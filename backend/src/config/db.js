import mysql from "mysql2/promise";
import "dotenv/config";

let db ;
const env = process.env

try {
  db = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});
await db.getConnection();
console.log(`Connection to db ${env.DB_NAME} successful`);
} catch (error) {
  console.error('Error connecting to the database', error.message)
  process.exit(1)
}

export {db}