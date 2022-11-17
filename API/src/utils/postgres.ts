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
  database  : "refactored",
  //database  : "tipmate", 
  username  : POSTGRES_USER,
  password  : POSTGRES_PASSWORD,
  ssl       : true,
});

export const utils = {
  /**
   * @function    :   registerUser()        
   *   
   * @brief   This function creates a new entry in the accounts database with the email and
   *          password provided. Before making any inserts, it will check that the email 
   *          provided hasn't been used for an already existing account, and will return an 
   *          error if that's the case.
   * 
   * @param   user        AuthRequestBody    interface with an email string and a password string
   * 
   * @return  user_id  :  number  |  e  :  Error
   * 
   * @example
   *      registerUser({ email: "example@example.com", password: "123SafePassword" });
   *      await registerUser(user2);
   */
  registerUser: async (user: AuthRequestBody) => {
    try {
      const lookUp = await sql`SELECT id FROM accounts
      WHERE email = ${user.email}`;
      if (lookUp.count != 0) {
        throw new Error("Email is already registered.");
      }

      const create = await sql`INSERT INTO accounts (email, password, created_on, last_login, verified)
      VALUES (${user.email}, ${""}, current_timestamp, current_timestamp, FALSE)
      RETURNING id`;
      let user_id = create[0].id;

      bcrypt.hash(user.password, saltRounds, async (err, hash: string) => {
        if (err) {
          console.log(err);
          return err;
        }

        const update =
          await sql`UPDATE accounts
          SET password = ${hash}
          WHERE id = ${user_id}`;
      });

      return +user_id;
    } catch (e) {
      console.log("Error inserting into accounts postgres", e);
      return e;
    }
  },

  /**
   * @function    :   verifyUser()        
   *   
   * @brief   This function updates the 'verified' value in the accounts table in the database to
   *          true for the user whose id is specified in user_id. Returns true if the update was
   *          successful, and false if there was an error during the database query.
   * 
   * @param   user_id     number      id of user in accounts table in database
   * 
   * @return  Boolean
   * 
   * @example
   *      verifyUser(1)
   *      await verifyUser(90);
   */
  verifyUser: async(user_id: number) => {
    try {
      await sql`UPDATE accounts
      set verified = TRUE
      WHERE id = ${user_id}`;

      return true;
    } catch(e) {
      console.log("Error veryfing account", e);
      return false;
    }  
  },

  login: async (user: AuthRequestBody) => {
    try {
      const result = await sql`SELECT verified, password FROM accounts
         WHERE email = ${user.email}`;

      let verified = result[0].verified;
      if (!verified) {
        return "Account not verified";
      }

      let password = "" + result[0].password;
      let isValid = await new Promise((res, rej) => {
        bcrypt.compare(user.password, password, (err, result) => {
          res(result);
        });
      });

      if (!isValid) {
        return "Invalid username/password";
      }

      return null;
    } catch (e) {
      console.log("Error getting user during login postgres", e);
      return e;
    }
  },

  /**
   * @function    :   onboarding()        
   *   
   * @brief   This function adds an entry to the profiles table in the database with the info
   *          specified in 'profile'. If the workAddress component is specified, this function will
   *          first create an entry in the locations table with the info in workAddress, and the 
   *          location id obtained from said insertion will be entered into the work_location 
   *          column in profiles. Then, the profile id obtained from inserting into profiles will
   *          be entered as the profile_id corresponding to the user's record in the accounts table
   *          in the database.
   * 
   * @param   profile      ProfileReqBody    interface with profile info*
   *                                       * see '/API/src/models/models.ts'
   * 
   * @return  Boolean
   * 
   * @example
   *      onboarding(profile1);
   *      await onbparding(profile2);
   */
  onboarding: async (profile: ProfileReqBody) => {
    try {
      let location_id = null;
      if (profile.workAddress != null) {
        let a = profile.workAddress;
        const insLocation = await sql`INSERT INTO locations (address_1, address_2, city, state, zip_code)
        VALUES (${a.address1}, ${a.address2}, ${a.city}, ${a.state}, ${a.zip_code})
        RETURNING location_id`;

        location_id = insLocation[0].location_id;
      }

      const insert = await sql`insert into profiles (employee_type, hours_per_week, work_location, fixed_wage, user_id, last_modified)
        values (${profile.employeeType}, ${profile.hoursPerWeek ?? null}, 
        ${location_id}, ${profile.wage}, ${profile.userId}, current_timestamp)
        RETURNING profile_id`;
      
      let profile_id = insert[0].profile_id;
      

      await sql`update accounts
        set profile_id = ${profile_id}
        WHERE id = ${profile.userId}`;
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

  getAccount: async(user: AuthRequestBody) => {
    try {
      const result = await sql`SELECT * from accounts
      WHERE email = ${user.email}`;

      if (result.length == 0) {
        return null;
      }

      return result[0];
    } catch(e) {
      console.log("Error getting account from database", e);
      return null;
    }
  },

  addTip: async (user: AuthRequestBody, amount: string) => {
    try {
      const idResult = await sql`SELECT id FROM accounts
        WHERE email = ${user.email}`;

      if (idResult.length == 0) {
        return false;
      }

      let id: number = +(""+idResult[0].id);

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
      console.log("Error getting tips from database", e);
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
      VALUES (${profile_id}::BIGINT, ${cost2Own}::FLOAT8::NUMERIC::MONEY, ${make}, ${model}, ${year}::INT)
      RETURNING vehicle_id`;

      return result[0].vehicle_id;
    } catch (e) {
      console.log("Error adding car to database", e);
      return null;
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

  patchVehicle:async (vehicle_id: number, vehicle: any) => {
    try {
      const result = await sql`UPDATE vehicles
        SET ${sql(vehicle)}
        WHERE vehicle_id = ${vehicle_id}`;

      return true;
    } catch (e) {
      console.log("Error patching vehicle in database", e);
      return false;
    }
  },

  addLocation: async(address1: string, address2: string, city: string, state: string, zip_code: string) => {
    try {
      const result = await sql`INSERT INTO locations (address_1, address_2, city, state, zip_code)
        VALUES (${address1}, ${address2}, ${city}, ${state}, ${zip_code})
        RETURNING location_id`;

      return result[0].location_id;
    } catch(e) {
      console.log("Error adding location to database", e);
      return null;
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

  patchLocation: async(location_id: number, location: any) => {
    try {
      const updateResult = await sql`UPDATE locations
      SET ${sql(location)}
      WHERE location_id = ${location_id}`;

      return true;
    } catch(e) {
      console.log("Error patching location in database", e);
      return false;
    }
  },
};
