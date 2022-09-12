import { Client, Query } from "ts-postgres";
import { AuthRequestBody } from "../models/models";

console.log(process.env.POSTGRES_USER);

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: "tippal",
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

export const utils = {
  connectDB: async () => {
    await client.connect();
    return "connected";
  },
  disconnect: async () => {
    await client.end();
    return "ended";
  },
  registerUser: async (user: AuthRequestBody) => {
    try {
      const result = await client.query(
        `INSERT INTO accounts (email, password, created_on, last_login)
         VALUES ($1, $2, current_timestamp, current_timestamp)`,
        [user.email, user.password]
      );

      console.log(result);
    } catch (e) {
      console.log("Error inserting into accounts postgres", e);
    }
  },
  login: async (user: AuthRequestBody) => {
    try {
      const result = await client.query(
        `SELECT email FROM accounts
         WHERE email = $1
         AND password = $2`,
        [user.email, user.password]
      );

      console.log(result);
      return result.status;
    } catch (e) {
      console.log("Error getting user during login postgres", e);
      return e;
    }
  },
};
