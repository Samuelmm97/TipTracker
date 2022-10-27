import postgres from "postgres";
import { Client, Query } from "ts-postgres";
import { AuthRequestBody, ProfileReqBody } from "../models/models";
import bcrypt from "bcrypt";
// import { Result } from "ts-postgres/dist/src/result";

const saltRounds = 10;

const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

if (!POSTGRES_USER || !POSTGRES_HOST || !POSTGRES_PASSWORD) {
  console.log("MISSING POSTGRES CREDENTIALS");
  process.exit(0);
}

const sql = postgres({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: "tipmate",
  password: POSTGRES_PASSWORD,
  port: 5432,
  ssl: true,
});

export const utils = {
  registerUser: async (user: AuthRequestBody) => {
    try {
      bcrypt.hash(user.password, saltRounds, async (err, hash: string) => {
        if (err) {
          console.log(err);
          return err;
        }

        const result =
          await sql`INSERT INTO accounts (email, password, created_on, last_login)
          VALUES (${user.email}, ${hash}, current_timestamp, current_timestamp)`;
      });
    } catch (e) {
      console.log("Error inserting into accounts postgres", e);
      return e;
    }
  },
  login: async (user: AuthRequestBody) => {
    try {
      const result = await sql`SELECT password FROM accounts
         WHERE email = ${user.email}`;

      let password = "" + result[0].password;
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
  onboarding: async (profile: ProfileReqBody) => {
    try {
      await sql`insert into profile (employee_type, hours_per_week, work_address, wage, user_id, last_modified)
         values (${profile.employeeType}, ${profile.hoursPerWeek ?? null}, ${
        profile.workAddress ?? null
      }, ${profile.wage}, ${profile.userId}, current_timestamp)`;

      return true;
    } catch (e) {
      console.log("Error onboarding postgres", e);
      return false;
    }
  },
  getProfile: async (userId: string) => {
    try {
      const result = await sql`SELECT * FROM profile
         WHERE user_id = ${userId}`;
      return result[0];
    } catch (e) {
      console.log("Error getting profile postgres", e);
      return false;
    }
  },
  updateProfile: async (userId: string, profile: any) => {
    try {
      const result = await sql`update profile
                              set ${sql(profile)},
                              "last_modified" = current_timestamp
                              WHERE user_id = ${userId}`;
      return true;
    } catch (e) {
      console.log("Error getting profile postgres", e);
      return false;
    }
  },

  addTip: async (user: AuthRequestBody, amount: string) => {
    try {
      const idResult = await sql`SELECT id FROM accounts
        WHERE email = ${user.email}`;

      if (idResult.length == 0) {
        return false;
      }

      let id: number = +("" + idResult[0].id);

      const tipResult =
        await sql`INSERT INTO transactions (tip_amount, user_id, tip_date) 
        VALUES (${amount}::FLOAT8::NUMERIC::MONEY, ${id}, current_timestamp)`;

      return true;
    } catch (e) {
      console.log("Error adding tip to database", e);
      return false;
    }
  },

  getTips: async (user: AuthRequestBody, period: number) => {
    try {
      const idResult = await sql`SELECT id FROM accounts
        WHERE email = ${user.email}`;
      if (idResult.length == 0) {
        return null;
      }
      let id: number = +("" + idResult[0].id);
      const histResult = await sql`SELECT * FROM transactions
          WHERE user_id = ${id} AND tip_date > (current_timestamp::DATE - ${period}::integer)`;
      if (histResult.length == 0) {
        return null;
      }
      console.log(histResult);
      return histResult;
    } catch (e) {
      console.log("Error adding tip to database", e);
      return null;
    }
  },

  deleteTip: async (user: AuthRequestBody, id: number) => {
    try {
      const deleteResult = await sql`DELETE FROM transactions
        WHERE id = ${id}`;
      return true;
    } catch (e) {
      console.log("Error deleting tip from database", e);
      return false;
    }
  },

  updateTip: async (user: AuthRequestBody, id: number, value: string) => {
    try {
      const updateResult = await sql`UPDATE transactions
        SET tip_amount = ${value}::FLOAT8::NUMERIC::MONEY
        WHERE id = ${id}`;
      return true;
    } catch (e) {
      console.log("Error updating tip on database", e);
      return false;
    }
  },
};
