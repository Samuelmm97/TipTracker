import postgres from "postgres";
import { AuthRequestBody, ProfileReqBody, VehiclePatchMode, LocationPatchMode } from "../models/models";
import bcrypt from "bcrypt";
import { add } from "date-fns";
// import { Result } from "ts-postgres/dist/src/result";

const saltRounds = 10;

const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

if (!POSTGRES_USER || !POSTGRES_HOST || !POSTGRES_PASSWORD) {
  console.log("MISSING POSTGRES CREDENTIALS");
  process.exit(0);
}
/*
const client = new Client({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: "tipmate",
  password: POSTGRES_PASSWORD,
  port: 5432,
  ssl: true,
});*/

const sql = postgres({
  host : POSTGRES_HOST,
  port : 5432,
  database : "tipmate",
  username : POSTGRES_USER,
  password : POSTGRES_PASSWORD,
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

  //Status: done, testing needed
  addVehicle: async (id: number, cost2Own: number, make: string, model: string, year: number) => {
    try {
      const result = await sql`INSERT INTO vehicles (profile_id, cost_to_own, make, nodel, year)
      VALUES (${id}::BIGINT, ${cost2Own}::FLOAT8::NUMERIC::MONEY, ${make}, ${model}, ${year}::INT)`;

      return true;
    } catch (e) {
      console.log("Error adding car to database", e);
      return false;
    }
  },

  //Status: done, testing needed
  getVehicle: async(id: number) => {
    try {
      const vehicleResult = await sql`SELECT * FROM vehicles
        WHERE profile_id = ${id}`;

      if (vehicleResult.length == 0) {
        return null;
      }

      /*
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
      };*/

      return vehicleResult;
    } catch(e) {
      console.log("Error getting vehicle from database", e);
      return null;
    }
  },

  //Status: done, testing needed
  deleteVehicle: async(id: number) => {
    try {
      const deleteResult = await sql`DELETE FROM vehicles
        WHERE vehicle_id = ${id}`;

      return true;
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
          updateResult = await sql`UPDATE vehicles
            SET cost_to_own = ${value}::FLOAT8::NUMERIC::MONEY
            WHERE vehicle_id = ${id}`;
          break;
        case VehiclePatchMode.make:
          updateResult = await sql`UPDATE vehicles
            SET make = ${value}
            WHERE vehicle_id = ${id}`;
          break;
        case VehiclePatchMode.model:
          updateResult = await sql`UPDATE vehicles
            SET model = ${value}
            WHERE vehicle_id = ${id}`;
          break;
        case VehiclePatchMode.year:
          updateResult = await sql`UPDATE vehicles
            SET make = ${value}::INT
            WHERE vehicel_id = ${id}`;
          break;
        default:
          return false;
      }

      return true;

    } catch(e) {
      console.log("Error patching vehicle in database", e);
      return false;
    }
  },

  //Status: done, testing needed
  addLocation: async(address1: string, address2: string, city: string, state: string, zip_code: string) => {
    try {
      const result = await sql`INSERT INTO locations (address1, address2, city, state, zip_code)
        VALUES (${address1}, ${address2}, ${city}, ${state}, ${zip_code})`;

      return true;
    } catch(e) {
      console.log("Error adding location to database", e);
      return false;
    }
  },

  //TODO: apply different search modes?
  getLocation: async(id: number) => {
    try {
      const locationResult = await sql`SELECT * FROM locations
        WHERE location_id = ${id}`;

      if (locationResult.length == 0) {
        return null;
      }
      /*
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
      };*/

      return locationResult;
    } catch(e) {
      console.log("Error getting location", e);
      return null;
    }
  },

  //Status: done, testing needed
  // In what situations should a location be deleted?
  deleteLocation: async(id: number) => {
    try {
      const deleteResult = await sql`DELETE FROM locations
        WHERE location_id = ${id}`;

      return true;
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
          updateResult = await sql`UPDATE locations
            SET address1 = ${id}
            WHERE location_id = ${value}`;
          break;
        case LocationPatchMode.address2:
          updateResult = await sql`UPDATE locations
            SET address2 = ${id}
            WHERE location_id = ${value}`;
          break;
        case LocationPatchMode.city:
          updateResult = await sql`UPDATE locations
            SET city = ${id}
            WHERE location_id = ${value}`;
          break;
        case LocationPatchMode.state:
          updateResult = await sql`UPDATE locations
            SET state = ${id}
            WHERE location_id = ${value}`;
          break;
        case LocationPatchMode.zip_code:
          updateResult = await sql`UPDATE locations
            SET zip_code = ${id}
            WHERE location_id = ${value}`;
          break;
        default:
          return false;
      }

      return true;
    } catch(e) {
      console.log("Error updating location", e);
      return false;
    }
  },
};
