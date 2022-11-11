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

const sql = postgres({
  host      : POSTGRES_HOST,
  port      : 5432,
  database  : "tipmate",
  username  : POSTGRES_USER,
  password  : POSTGRES_PASSWORD,
  ssl       : true,
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
      await sql`insert into profiles (employee_type, hours_per_week, work_address, wage, user_id, last_modified)
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

  addVehicle: async (profile_id: number, cost2Own: number, make: string, model: string, year: number) => {
    try {
      const result = await sql`INSERT INTO vehicles (profile_id, cost_to_own, make, model, year)
      VALUES (${profile_id}::BIGINT, ${cost2Own}::FLOAT8::NUMERIC::MONEY, ${make}, ${model}, ${year}::INT)`;

      return true;
    } catch (e) {
      console.log("Error adding car to database", e);
      return false;
    }
  },

  getVehicle: async(profile_id: number) => {
    try {
      const vehicleResult = await sql`SELECT * FROM vehicles
        WHERE profile_id = ${profile_id}`;

      if (vehicleResult.length == 0) {
        return null;
      }

      return vehicleResult;
    } catch(e) {
      console.log("Error getting vehicle from database", e);
      return null;
    }
  },

  deleteVehicle: async(vehicle_id: number) => {
    try {
      const deleteResult = await sql`DELETE FROM vehicles
        WHERE vehicle_id = ${vehicle_id}`;

      return true;
    } catch(e) {
      console.log("Error deleting vehicle from database", e);
      return false;
    }
  },

  patchVehicle: async(mode: VehiclePatchMode, vehicle_id: number, value: string) => {
    try {
      let updateResult = null;

      switch (mode) {
        case VehiclePatchMode.cost_to_own:
          updateResult = await sql`UPDATE vehicles
            SET cost_to_own = ${value}::FLOAT8::NUMERIC::MONEY
            WHERE vehicle_id = ${vehicle_id}`;
          break;
        case VehiclePatchMode.make:
          updateResult = await sql`UPDATE vehicles
            SET make = ${value}
            WHERE vehicle_id = ${vehicle_id}`;
          break;
        case VehiclePatchMode.model:
          updateResult = await sql`UPDATE vehicles
            SET model = ${value}
            WHERE vehicle_id = ${vehicle_id}`;
          break;
        case VehiclePatchMode.year:
          updateResult = await sql`UPDATE vehicles
            SET year = ${value}::INT
            WHERE vehicle_id = ${vehicle_id}`;
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

  addLocation: async(address1: string, address2: string, city: string, state: string, zip_code: string) => {
    try {
      const result = await sql`INSERT INTO locations (address_1, address_2, city, state, zip_code)
        VALUES (${address1}, ${address2}, ${city}, ${state}, ${zip_code})`;

      return true;
    } catch(e) {
      console.log("Error adding location to database", e);
      return false;
    }
  },

  //TODO: apply different search modes?
  getLocation: async(location_id: number) => {
    try {
      const locationResult = await sql`SELECT * FROM locations
        WHERE location_id = ${location_id}`;

      if (locationResult.length == 0) {
        return null;
      }

      return locationResult;
    } catch(e) {
      console.log("Error getting location", e);
      return null;
    }
  },

  // In what situations should a location be deleted?
  deleteLocation: async(location_id: number) => {
    try {
      const deleteResult = await sql`DELETE FROM locations
        WHERE location_id = ${location_id}`;

      return true;
    } catch(e) {
      console.log("Error deleting location from database", e);
      return false;
    }
  },

  // In what situations should a location be updated?
  patchLocation: async(mode: LocationPatchMode, location_id: number, value: string) => {
    try {
      let updateResult = null;

      switch(mode) {
        case LocationPatchMode.address1:
          updateResult = await sql`UPDATE locations
            SET address_1 = ${value}
            WHERE location_id = ${location_id}`;
          break;
        case LocationPatchMode.address2:
          updateResult = await sql`UPDATE locations
            SET address_2 = ${value}
            WHERE location_id = ${location_id}`;
          break;
        case LocationPatchMode.city:
          updateResult = await sql`UPDATE locations
            SET city = ${value}
            WHERE location_id = ${location_id}`;
          break;
        case LocationPatchMode.state:
          updateResult = await sql`UPDATE locations
            SET state = ${value}
            WHERE location_id = ${location_id}`;
          break;
        case LocationPatchMode.zip_code:
          updateResult = await sql`UPDATE locations
            SET zip_code = ${value}
            WHERE location_id = ${location_id}`;
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
