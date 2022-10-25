import { Client, Query } from "ts-postgres";
import { AuthRequestBody, VehiclePatchMode, LocationPatchMode } from "../models/models";
import bcrypt from "bcrypt";
import { Result } from "ts-postgres/dist/src/result";
import { add } from "date-fns";

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
            SELECT $2, $3, current_timestamp, current_timestamp
            WHERE NOT EXISTS (SELECT * FROM accounts WHERE email = $1)`,
          [user.email, user.email, hash]
        );
        console.log(result);
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
      let id: number = +("" + idResult.rows[0][0]);

      const tipResult = await client.query(
        `INSERT INTO transactions (tip_amount, user_id, tip_date) 
        VALUES ($1::FLOAT8::NUMERIC::MONEY, $2, current_timestamp)`,
        [amount, id]
      );

      return true;
    } catch (e) {
      console.log("Error adding tip to database", e);
      return false;
    }
  },

  getTips: async (user: AuthRequestBody, period: number) => {
    try {
      const idResult = await client.query(
        `SELECT user_id FROM accounts
        WHERE email = $1`,
        [user.email]
      );

      if (idResult.status === "SELECT 0") {
        return null;
      }
      let id: number = +("" + idResult.rows[0][0]);

      const histResult = await client.query(
        `SELECT * FROM transactions
          WHERE user_id = $1 AND tip_date > (current_timestamp::DATE - $2::integer)`,
        [id, period]
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
          switch (j) {
            case 0:
              ids.push(+("" + histResult.rows[i][j]));
              break;
            case 1:
              tips.push("" + histResult.rows[i][j]);
              break;
            case 2:
              usr_ids.push(+("" + histResult.rows[i][j]));
              break;
            case 3:
              dates.push("" + histResult.rows[i][j]);
              break;
            default:
          }
        }
      }

      let history = {
        tip_ids: ids,
        tips: tips,
        usr_ids: usr_ids,
        dates: dates,
      };
      return history;
    } catch (e) {
      console.log("Error adding tip to database", e);
      return null;
    }
  },

  deleteTip: async (user: AuthRequestBody, id: number) => {
    try {
      const usrIdResult = await client.query(
        `SELECT user_id FROM transactions
        WHERE id = $1`,
        [id]
      );

      if (usrIdResult.status === "SELECT 0") {
        return false;
      }
      let usrId: number = +("" + usrIdResult.rows[0][0]);

      const emailResult = await client.query(
        `SELECT email FROM accounts
        WHERE user_id = $1`,
        [usrId]
      );

      if (emailResult.status === "SELECT 0") {
        return false;
      }
      let email: string = "" + emailResult.rows[0][0];

      if (email != user.email) {
        return false;
      }

      const deleteResult = await client.query(
        `DELETE FROM transactions
        WHERE id = $1`,
        [id]
      );

      return deleteResult.status === "DELETE 1";
    } catch (e) {
      console.log("Error deleting tip from database", e);
      return false;
    }
  },

  updateTip: async (user: AuthRequestBody, id: number, value: string) => {
    try {
      const usrIdResult = await client.query(
        `SELECT user_id FROM transactions
        WHERE id = $1`,
        [id]
      );

      if (usrIdResult.status === "SELECT 0") {
        return false;
      }
      let usrId: number = +("" + usrIdResult.rows[0][0]);

      const emailResult = await client.query(
        `SELECT email FROM accounts
        WHERE user_id = $1`,
        [usrId]
      );

      if (emailResult.status === "SELECT 0") {
        return false;
      }
      let email: string = "" + emailResult.rows[0][0];

      if (email != user.email) {
        return false;
      }

      const updateResult = await client.query(
        `UPDATE transactions
        SET tip_amount = $1::FLOAT8::NUMERIC::MONEY
        WHERE id = $2`,
        [value, id]
      );

      return updateResult.status === "UPDATE 1";
    } catch (e) {
      console.log("Error updating tip on database", e);
      return false;
    }
  },

  //Status: done, testing needed
  addVehicle: async (id: number, cost2Own: number, make: string, model: string, year: number) => {
    try {
      const result = await client.query(
      `INSERT INTO vehicles (profile_id, cost_to_own, make, nodel, year)
      VALUES ($1::BIGINT, $2::FLOAT8::NUMERIC::MONEY, $3, $4, $5::INT)`,
      [id, cost2Own, make, model, year]
      );

      return true;
    } catch (e) {
      console.log("Error adding car to database", e);
      return false;
    }
  },

  //Status: done, testing needed
  getVehicle: async(id: number) => {
    try {
      const vehicleResult = await client.query(
        `SELECT * FROM vehicles
        WHERE profile_id = $1`,
        [id]
      );

      if (vehicleResult.status === "SELECT 0") {
        return null;
      }

      let cost_to_own: number[] = [];
      let make: string[] = [];
      let model: string[] = [];
      let year: number[] = [];

      for (let i = 0; i < vehicleResult.rows.length; ++i) {
        for (let j = 0; j < vehicleResult.rows[0].length; ++j) {
          switch (j) {
            case 0:
              cost_to_own.push(+(""+vehicleResult.rows[i][j]));
              break;
            case 1:
              make.push(""+vehicleResult.rows[i][j]);
              break;
            case 2:
              model.push(""+vehicleResult.rows[i][j]);
              break;
            case 3:
              year.push(+(""+vehicleResult.rows[i][j]));
              break;
            default:
          }
        }
      }

      let vehicle = {
        cost_to_own: cost_to_own,
        make: make,
        model: model,
        year: year,
      };

      return vehicle;
    } catch(e) {
      console.log("Error getting vehicle from database", e);
      return null;
    }
  },

  //Status: done, testing needed
  deleteVehicle: async(id: number) => {
    try {
      const deleteResult = await client.query(
        `DELETE FROM vehicles
        WHERE vehicle_id = $1`,
        [id]
      );

      return deleteResult.status === "DELETE 1";
    } catch(e) {
      console.log("Error deleting vehicle from database", e);
      return false;
    }
  },

  //Status: done, testing needed
  patchVehicle: async(mode: VehiclePatchMode, id: number, value: string) => {
    try {
      let updateResult = null;

      switch (mode) {
        case VehiclePatchMode.cost_to_own:
          updateResult = await client.query(
            `UPDATE vehicles
            SET cost_to_own = $1::FLOAT8::NUMERIC::MONEY
            WHERE vehicle_id = $2`,
            [value, id]
          );
          break;
        case VehiclePatchMode.make:
          updateResult = await client.query(
            `UPDATE vehicles
            SET make = $1
            WHERE vehicle_id = $2`,
            [value, id]
          );
          break;
        case VehiclePatchMode.model:
          updateResult = await client.query(
            `UPDATE vehicles
            SET model = $1
            WHERE vehicle_id = $2`,
            [value, id]
          );
          break;
        case VehiclePatchMode.year:
          updateResult = await client.query(
            `UPDATE vehicles
            SET make = $1::INT
            WHERE vehicel_id = $2`,
            [value, id]
          );
          break;
        default:
          return false;
      }

      return updateResult.status === "UPDATE 1";

    } catch(e) {
      console.log("Error patching vehicle in database", e);
      return false;
    }
  },

  //Status: done, testing needed
  addLocation: async(address1: string, address2: string, city: string, state: string, zip_code: string) => {
    try {
      const result = await client.query(
        `INSERT INTO locations (address1, address2, city, state, zip_code)
        VALUES ($1, $2, $3, $4, $5)`,
        [address1, address2, city, state, zip_code]
      );

      return result.status === "INSERT 1"
    } catch(e) {
      console.log("Error adding location to database", e);
      return false;
    }
  },

  //TODO: apply different search modes?
  getLocation: async(id: number) => {
    try {
      const locationResult = await client.query(
        `SELECT * FROM locations
        WHERE location_id = $1`,
        [id]
      );

      if (locationResult.status === "SELECT 0") {
        return null;
      }

      let address1: string[] = [];
      let address2: string[] = [];
      let city: string[] = [];
      let state: string[] = [];
      let zip_code: string[] = [];

      for (let i = 0; i < locationResult.rows.length; ++i) {
        for (let j = 0; j < locationResult.rows[0].length; ++j) {
          switch (j) {
            case 0:
              address1.push(""+locationResult.rows[i][j]);
              break;
            case 1:
              address2.push(""+locationResult.rows[i][j]);
              break;
            case 2:
              city.push(""+locationResult.rows[i][j]);
              break;
            case 3:
              state.push(""+locationResult.rows[i][j]);
              break;
            case 4:
              zip_code.push(""+locationResult.rows[i][j]);
              break;
            default:
          }
        }
      }

      let locations = {
        adress1: address1,
        address2: address2,
        city: city,
        state: state,
        zip_code: zip_code,
      };

      return locations;
    } catch(e) {
      console.log("Error getting location", e);
      return null;
    }
  },

  //Status: done, testing needed
  // In what situations should a location be deleted?
  deleteLocation: async(id: number) => {
    try {
      const deleteResult = await client.query(
        `DELETE FROM locations
        WHERE location_id = $1`,
        [id]
      );

      return deleteResult.status === "DELETE 1";
    } catch(e) {
      console.log("Error deleting location from database", e);
      return false;
    }
  },

  //Status: done, testing needed
  // In what situations should a location be updated?
  patchLocation: async(mode: LocationPatchMode, id: number, value: string) => {
    try {
      let updateResult = null;

      switch(mode) {
        case LocationPatchMode.address1:
          updateResult = await client.query(
            `UPDATE locations
            SET address1 = $1
            WHERE location_id = $2`,
            [id, value]
          );
          break;
        case LocationPatchMode.address2:
          updateResult = await client.query(
            `UPDATE locations
            SET address2 = $1
            WHERE location_id = $2`,
            [id, value]
          );
          break;
        case LocationPatchMode.city:
          updateResult = await client.query(
            `UPDATE locations
            SET city = $1
            WHERE location_id = $2`,
            [id, value]
          );
          break;
        case LocationPatchMode.state:
          updateResult = await client.query(
            `UPDATE locations
            SET state = $1
            WHERE location_id = $2`,
            [id, value]
          );
          break;
        case LocationPatchMode.zip_code:
          updateResult = await client.query(
            `UPDATE locations
            SET zip_code = $1
            WHERE location_id = $2`,
            [id, value]
          );
          break;
        default:
          return false;
      }

      return updateResult.status === "UPDATE 1";
    } catch(e) {
      console.log("Error updating location", e);
      return false;
    }
  },
};
