import { Client, Query } from "ts-postgres";
import { AuthRequestBody } from "../models/models";
import bcrypt from "bcrypt";
import { Result } from "ts-postgres/dist/src/result";

const saltRounds = 10;

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
  // Assumes currency is dollars (temporary)
  addTip: async (user: AuthRequestBody, amount: string) => {
    try {
      const idResult = await client.query(
        `SELECT user_id FROM accounts
        WHERE email = $1`,
        [user.email]
      );

      if (idResult.status === "SELECT 0") {
        return false;
      }
      let id : number = +("" + idResult.rows[0][0]);

      // TODO: add time field to table 
      const tipResult = await client.query(
        `INSERT INTO transactions (tip_amount, driver_id)
        values ($1::float8::numeric::money, $2)`,
        [amount, id]
      );

      return true;
    } catch(e) {
      console.log("Error adding tip to database", e);
      return false;
    }
  },
};
