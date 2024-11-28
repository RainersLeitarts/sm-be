import pg from "pg";
import "dotenv/config"
const { Client } = pg;
const client = new Client();

export default client;
