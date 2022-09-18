import { Client, Query } from "ts-postgres";
import { AuthRequestBody } from "../models/models";
import bcrypt from "bcrypt";

const saltRounds = 10;

const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

if (!POSTGRES_USER || !POSTGRES_HOST || !POSTGRES_PASSWORD) {
  console.log("MISSING POSTGRES CREDENTIALS");
  process.exit(0);
}

const client = new Client({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: "tippal",
  password: POSTGRES_PASSWORD,
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
      bcrypt.hash(user.password, saltRounds, async (err, hash: string) => {
        if (err) {
          console.log(err);
          return err;
        }

        const result = await client.query(
          `INSERT INTO accounts (email, password, created_on, last_login)
          VALUES ($1, $2, current_timestamp, current_timestamp)`,
          [user.email, hash]
        );
      });
    } catch (e) {
      console.log("Error inserting into accounts postgres", e);
      return e;
    }
  },
  login: async (user: AuthRequestBody) => {
    try {
      const result = await client.query(
        `SELECT password FROM accounts
         WHERE email = $1`,
        [user.email]
      );

      if (result.status === "SELECT 0") {
        return false;
      }
      let password = "" + result.rows[0][0];
      let isValid = await new Promise((res, rej) => {
        bcrypt.compare(user.password, password, (err, result) => {
          res(result);
        });
      });

      return isValid;
    } catch (e) {
      console.log("Error getting user during login postgres", e);
      return false;
    }
  },
};
