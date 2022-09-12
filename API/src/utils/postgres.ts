import { Client, Query } from "ts-postgres";
import { AuthRequestBody } from "../models/models";

const client = new Client({
  user: "tipappadmin",
  host: "tipappserver.postgres.database.azure.com",
  database: "tippal",
  password: "VFEe3Au5KUKznL6",
  port: 5432,
});

export const utils = {
  connectDB: async () => {
    return client.connect();
  },
  disconnect: async () => {
    await client.end();
    return "ended";
  },
  testClient: async () => {
    try {
      const result = client.query("SELECT * from person");

      for await (const row of result) {
        // 'Hello world!'
        console.log("test", row.data);
      }
    } finally {
      await client.end();
    }
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
    } finally {
      if (!client.closed) await client.end();
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
    } finally {
      if (!client.closed) await client.end();
    }
  },
};
