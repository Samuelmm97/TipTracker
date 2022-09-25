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

  addTip: async (user: AuthRequestBody, amount: string, time: string) => {
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

      const tipResult = await client.query(
        `INSERT INTO transactions (tip_amount, user_id, tip_date) 
        VALUES ($1::FLOAT8::NUMERIC::MONEY, $2, TO_DATE($3, 'YYYY-MM-DD'))`,
        [amount, id, time]
      );

      return true;
    } catch(e) {
      console.log("Error adding tip to database", e);
      return false;
    }
  },
  
  getTips: async(user: AuthRequestBody, time: string) => {
    try {
      const idResult = await client.query(
        `SELECT user_id FROM accounts
        WHERE email = $1`,
        [user.email]
      );

      console.log(user);
      if (idResult.status === "SELECT 0") {
        return null;
      }
      let id : number = +("" + idResult.rows[0][0]);

      const histResult = await client.query(
          `SELECT * FROM transactions
          WHERE user_id = $1 AND tip_date > TO_DATE($2, 'YYYY-MM-DD')`, 
          [id, time]
      );

      if (histResult.status === "SELECT 0") {
        return null;
      }

      let ids: number[] = [];
      let tips: string[] = [];
      let usr_ids: number[] = [];
      let dates: string[] = [];

      for (let i = 0; i < histResult.rows.length; ++i) {
        for (let j = 0; j < histResult.rows[0].length; ++j) {

          switch(j) {
            case 0:
              ids.push(+(""+histResult.rows[i][j]));
              break;
            case 1: 
              tips.push(""+histResult.rows[i][j]);
              break;
            case 2:
              usr_ids.push(+(""+histResult.rows[i][j]));
              break;
            case 3:
              dates.push(""+histResult.rows[i][j]);
              break;
            default:
          }
        }
      }

      let history: any = { "tip_ids": ids, "tips": tips, "usr_ids": usr_ids, "dates":dates };
      return history;

    } catch(e) {
      console.log("Error adding tip to database", e);
      return null;
    }
  },

  deleteTip: async(user: AuthRequestBody, id: number) => {
    try {
      const usrIdResult = await client.query(
        `SELECT user_id FROM transactions
        WHERE id = $1`,
        [id]
      );

      if (usrIdResult.status === "SELECT 0") {
        return false;
      }
      let usrId : number = +("" + usrIdResult.rows[0][0]);

      const emailResult = await client.query(
        `SELECT email FROM accounts
        WHERE user_id = $1`,
        [usrId]
      );

      if (emailResult.status === "SELECT 0") {
        return false;
      }
      let email : string = "" + emailResult.rows[0][0];

      if (email != user.email) {
        return false;
      }

      const deleteResult = await client.query(
        `DELETE FROM transactions
        WHERE id = $1`,
        [id]
      );

      return (deleteResult.status === "DELETE 1");

    } catch(e) {
      console.log("Error deleting tip from database", e);
      return false;
    }
  },

  updateTip: async(user: AuthRequestBody, id: number, value: string) => {
    try {
      const usrIdResult = await client.query(
        `SELECT user_id FROM transactions
        WHERE id = $1`,
        [id]
      );

      if (usrIdResult.status === "SELECT 0") {
        return false;
      }
      let usrId : number = +("" + usrIdResult.rows[0][0]);

      const emailResult = await client.query(
        `SELECT email FROM accounts
        WHERE user_id = $1`,
        [usrId]
      );

      if (emailResult.status === "SELECT 0") {
        return false;
      }
      let email : string = "" + emailResult.rows[0][0];

      if (email != user.email) {
        return false;
      }

      const updateResult = await client.query(
        `UPDATE transactions
        SET tip_amount = $1::FLOAT8::NUMERIC::MONEY
        WHERE id = $2`,
        [value, id]
      );

      return (updateResult.status === "UPDATE 1");

    } catch(e) {
      console.log("Error updating tip on database", e);
      return false;
    }
  },
};
