import "dotenv/config"
import { drizzle } from 'drizzle-orm/node-postgres';

console.log("url: ", process.env.DB_URL);
export default drizzle(process.env.DB_URL!);