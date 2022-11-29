import postgres from "postgres";
import { AuthRequestBody, ProfileReqBody, Car, Address, latlng } from "../models/models";
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
  database  : "prototype",
  //database  : "refactored", 
  username  : POSTGRES_USER,
  password  : POSTGRES_PASSWORD,
  ssl       : true,
});

export const utils = {
  /**
   * @function registerUser()        
   *   
   * @brief   This function creates a new entry in the accounts database with the email and
   *          password provided. Before making any inserts, it will check that the email 
   *          provided hasn't been used for an already existing account, and will return an 
   *          error if that's the case.
   * 
   * @param   {AuthRequestBody}   user    interface with an email string and a password string
   * 
   * @return  {number}    user_id
   * 
   * @example
   *      await registerUser({ email: "example@example.com", password: "123SafePassword" });
   */
  registerUser: async (user: AuthRequestBody) => {
    try {
      const lookUp = await sql`SELECT id FROM accounts
      WHERE email = ${user.email}`;
      if (lookUp.count != 0) {
        throw new Error("Email is already registered.");
      }

      const create = await sql`INSERT INTO accounts (email, password, created_on, last_login, verified)
      VALUES (${user.email}, ${""}, current_timestamp, current_timestamp, TRUE)
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
   * @function verifyUser()        
   *   
   * @brief   This function updates the 'verified' value in the accounts table in the database to
   *          true for the user whose id is specified in user_id. Returns true if the update was
   *          successful, and false if there was an error during the database query.
   * 
   * @param   {number}    user_id      id of user in accounts table in database
   * 
   * @return  {Boolean}
   * 
   * @example
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

  /**
   * @function login()
   * 
   * @brief   This function verifies the enail and pasword in the 'user' input by looking for a 
   *          match in the database. If an account is found but not verified, or its password does
   *          not match, it will not grant access to the user.
   * 
   * @param   {AuthRequestBody}   user 
   * 
   * @returns {String}
   * 
   * @example
   *      await login({ email: "example@aol.com", password: "111111111111" });
   */
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
        bcrypt.compare( password, user.password, (err, result) => {
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
   * @function onboarding()        
   *   
   * @brief   This function adds an entry to the profiles table in the database with the info
   *          specified in 'profile'. If the workAddress component is specified, this function will
   *          first create an entry in the locations table with the info in workAddress, and the 
   *          location id obtained from said insertion will be entered into the work_location 
   *          column in profiles. Then, the profile id obtained from inserting into profiles will
   *          be entered as the profile_id corresponding to the user's record in the accounts table
   *          in the database.
   * 
   * @param   {ProfileReqBody}    profile    interface with profile info*
   *                                       * see '/API/src/models/models.ts'
   * 
   * @return  {Boolean}
   * 
   * @example
   *      await onbparding(profile1);
   */
  onboarding: async (profile: ProfileReqBody, gcd: latlng) => {
    try {
      let location_id = null;
      if (profile.workAddress != null) {
        let a = profile.workAddress;
        const insLocation = await sql`INSERT INTO locations (address_1, address_2, city, state, zip_code, lat, lng)
        VALUES (${a.address_1}, ${a.address_2}, ${a.city}, ${a.state}, ${a.zip_code}, ${gcd.lat}, ${gcd.lng})
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

  /**
   * @function getProfile()
   * 
   * @brief   This function returns the entry in the profiles table in the db whose user_id matches
   *          the input 'userId'
   * 
   * @param     {string}    userId 
   * 
   * @returns   {}
   * 
   * @example
   *      await getProfile(100);
   */
  getProfile: async (userId: string) => {
    try {
      const result = await sql`SELECT * FROM profiles
         WHERE user_id = ${userId}`;
      return result[0];
    } catch (e) {
      console.log("Error getting profiles postgres", e);
      return false;
    }
  },

  /**
   * @function updateProfile()
   * 
   * @brief   This function updates the entry in the db table profiles with any fields specified in
   *          the 'profiile' input.
   * 
   * @param     {string}    userId 
   * @param     {any}       profile 
   * 
   * @returns   {boolean}
   * 
   * @example
   *       await updateProfile(19, { first_name: "Mark", hours_per_week: 14 });
   */
  updateProfile: async (userId: string, profile: any) => {
    try {
      const result = await sql`update profiles
                              set ${sql(profile)},
                              "last_modified" = current_timestamp
                              WHERE user_id = ${userId}`;
      return true;
    } catch (e) {
      console.log("Error getting profiles postgres", e);
      return false;
    }
  },


  /**
   * @function getAccount()
   * 
   * @brief   This function returns the entry in the accounts table in the db whose id matches
   *          the email field in 'user'.
   * 
   * @param   {AuthRequestBody}   user 
   * 
   * @returns {}
   * 
   * @example
   *      await getAccount({ email: "123@gmail.com", password: "0987654" });
   */
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

  /**
   * @function addTip()
   * 
   * @brief   This function inserts a tip into the database.
   * 
   * @param   {string}    amount 
   * @param   {number}    user_id
   * @param   {number}    location_id
   * 
   * @returns {Boolean}
   * 
   * @example
   *      await addTip("$23.12", 22, 42, 0);
   */
  addTip: async (amount: string, user_id: number, location_id: number, miles_driven: number) => {
    try {
      const tipResult =
        await sql`INSERT INTO transactions (tip_amount, user_id, location_id, tip_date, miles_driven) 
        VALUES (${amount}::FLOAT8::NUMERIC::MONEY, ${user_id}, ${location_id}::BIGINT, current_timestamp, ${miles_driven})`;

      return true;
    } catch (e) {
      console.log("Error adding tip to database", e);
      return false;
    }
  },


  /**
   * @function getTips()
   * 
   * @brief   This function returns any entries in the transactions db whose user_id values match 
   *          the input 'userId' and are within the time period in days specified in the 'period' 
   *          input.
   * 
   * @param   {number}    userId
   * @param   {number}    period 
   * 
   * @returns {}
   * 
   * @example
   *      getTips(user1, 7);
   *      await getTips(user2, 15);
   */
  getTips: async (userId: number, period: number) => {
    try {

      const histResult = await sql`SELECT * FROM transactions
          WHERE user_id = ${userId} AND tip_date > (current_timestamp::DATE - ${period}::integer)`;
      if (histResult.length == 0) {
        return null;
      }
      return histResult;
    } catch (e) {
      console.log("Error getting tips from database", e);
      return null;
    }
  },


  /**
   * @function deleteTip()
   * 
   * @brief   This function deletes the entry in the transactions table in the db whose id matches
   *          the input 'id'. Returns true if successful.
   * 
   * @param   {number}    id 
   * 
   * @returns  {Boolean}
   * 
   * @example
   *      await deleteTip(5);
   */
  deleteTip: async (id: number) => {
    try {
      const result = await sql`SELECT FROM transactions where id = ${id}`;
      const deleteResult = await sql`DELETE FROM transactions
        WHERE id = ${id}`;
      return true;
    } catch (e) {
      console.log("Error deleting tip from database", e);
      return false;
    }
  },


  /**
   * @function updateTip()
   * 
   * @nrief   This function updates the entry in the transactions db table whose id matches the 'id'
   *          input. 
   * 
   * @param   {number}    id 
   * @param   {any}       tip
   * 
   * @returns {Boolean}
   * 
   * @example
   *      await updateTip(999, { ampount: "$11.11", location_id: 123});
   */
  updateTip: async (id: number, tip: any) => {

    try {
      //const result = await sql`SELECT FROM transactions where id = ${id}`;
      await sql`UPDATE transactions
        SET ${sql(tip)}
        WHERE id = ${id}`;

      return true;
    } catch (e) {
      console.log("Error updating tip on database", e);
      return e;
    }
  },

  /**
   * @function addVehicle()
   * 
   * @brief   This function inserts a vehicle in the vehicle database table with the data specified
   *          by the inputs 'profile_id', 'cost_to_own' and 'car'.
   * 
   * @param   {number}    profile_id 
   * @param   {number}    cost_to_own 
   * @param   {Car}       car
   * 
   * @returns 
   * 
   * @example
   *      await addVehicle(16, 55.34, { make: "Honda", model: "Civic", year: "2011" });
   */
  addVehicle: async (profile_id: number, cost_to_own: number, car: Car) => {
    try {
      const result = await sql`INSERT INTO vehicles (profile_id, cost_to_own, make, model, year)
      VALUES (${profile_id}::BIGINT, ${cost_to_own}::FLOAT8::NUMERIC::MONEY, ${car.make}, ${car.model}, ${car.year}::INT)
      RETURNING vehicle_id`;

      return result[0].vehicle_id;
    } catch (e) {
      console.log("Error adding car to database", e);
      return null;
    }
  },

  /**
   * @function getVehicle()
   * 
   * @brief   This function returns the entry in the vehicles database table whose profile_id
   *          matches the input 'profile_id'.
   * 
   * @param   {number}    profile_id 
   * 
   * @returns 
   * 
   * @example
   *      await getVehicle(12);
   */
  getVehicle: async(profile_id: number) => {
    try {
      const vehicleResult = await sql`SELECT * FROM vehicles
        WHERE profile_id = ${profile_id}`;

      if (vehicleResult.length == 0) {
        return [];
      }

      return vehicleResult;
    } catch(e) {
      console.log("Error getting vehicle from database", e);
      return null;
    }
  },

  /**
   * @function deleteVehicle()
   * 
   * @brief   This function deletes the entry in the vehicles database table whose vehicle_id
   *          matches the input 'vehicle_id'.
   * 
   * @param   {number}    vehicle_id 
   * 
   * @returns {Boolean}
   * 
   * @example
   *      await deleteVehicle(12);
   */
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

  /**
   * @function patchVehicle()
   * 
   * @brief   This function updates an entry in the vehicles database table whose vehicle_id matches
   *          the input 'vehicle_id'. The fields updated are specified in the 'vehicle' input.
   * 
   * @param   {number}    vehicle_id 
   * @param   {any}       vehicle 
   * 
   * @returns 
   * 
   * @example
   *      await patchVehicle(12, { make: "Toyota" });
   *      await patchVehicle(91, { model: "Civic", year: "2014" });
   */
  patchVehicle: async (vehicle_id: number, vehicle: any) => {
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

  /**
   * @function addLocation()
   * 
   * @brief   This function inserts a location in the locations database table with the data
   *          specified in the 'address' and 'latlng' inputs.
   * 
   * @param   {Address}   address 
   * @param   {latlng}    latlng 
   * 
   * @returns 
   * 
   * @example
   *      await addLocation(address1, latlng1);
   *      await addLocation( {
   *          address_1: "100 road way",
   *          address_2: "",
   *          city: "Miami",
   *          state: "FL",
   *          zip_code: "22222"}, {
   *          lat: 14.234,
   *          lng: -8.123
   *      })
   */
  addLocation: async(address: Address, latlng: latlng) => {
    try {
      const a = address;
      const l = latlng;
      const result = await sql`INSERT INTO locations (address_1, address_2, city, state, zip_code, lat, lng)
        VALUES (${a.address_1}, ${a.address_2}, ${a.city}, ${a.state}, ${a.zip_code}, ${l.lat}, ${l.lng})
        RETURNING location_id`;

      return result[0].location_id;
    } catch(e) {
      console.log("Error adding location to database", e);
      return null;
    }
  },

  /**
   * @function getLocation()
   * 
   * @brief   This function returns the entry in the locations table in the database whose
   *          location_id matches the input 'location_id'.
   * 
   * @param   {number}    location_id 
   * 
   * @returns {}
   * 
   * @example
   *      await getLocation(14);
   */
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

  /**
   * @function deleteLocation()
   * 
   * @brief   This function deletes a location in the database whose location_id matches the input
   *          'location_id'
   * 
   * @param   {number}    location_id
   * 
   * @returns {Boolean}
   * 
   * @example
   *      await deleteLocation(14);
   */
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

  /**
   * @function patchLocation()
   * 
   * @brief   This function updates an entry in the locations database table whose location_id
   *          matches the input 'location_id'. The updates occur on the fields specified by the
   *          input 'location'
   * 
   * @param   {number}    location_id 
   * @param   {any}       location 
   * 
   * @returns {Boolean}
   * 
   * @example
   *      await patchLocation(53, { address_2: "Apt 404", zip_code: "55555" });
   *      await patchLocation(44, { city: "Ocala" });
   */
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

  /**
   * @function searchLocation()
   * 
   * @brief   This function searches through the locations table in the database for an entry that
   *          matches the fields specified in 'address'
   * 
   * @param   {any}   address 
   * 
   * @returns {number}
   * 
   * @example
   *      await searchLocation(profile1);
   *      await searchLocation({ address_1: "123 ne street", 
   *          address_2: "", 
   *          city: "Orlando",
   *          zip_code: "33333" 
   *      });
   */
  searchLocation: async(address: any) => {
    try {
      const result = await sql`SELECT * FROM locations
      WHERE address_1 = ${address.address_1}
      AND address_2 = ${address.address_2}
      AND city = ${address.city}
      AND state = ${address.state}
      AND zip_code = ${address.zip_code}`;

      if (result.length == 0) {
        return null;
      }

      return result[0].location_id;
    } catch(e) {
      console.log("Error searching location", e);
      return null;
    }
  },

  searchLocationGeo: async(latlng: latlng) => {
    try {
      const result = await sql`SELECT * FROM locations
      WHERE lat = ${latlng.lat}
      AND lng = ${latlng.lng}`;

      if (result.length == 0) {
        return null;
      }

      return result[0].location_id;
    } catch (e) {
      console.log("Error searching for lat and long in database", e);
      return null;
    }
  },

  /**
   * @function locationUses()
   * 
   * @brief   This function returns the number of transaction and profile entries in the database
   *          that use the location entry whose location_id matches the 'location_id' input.
   * 
   * @param   {number}    location_id 
   * 
   * @returns {number}
   * 
   * @example
   *      await locationUses(77);
   */
  locationUses: async(location_id: number) => {
    try {
      const transactions = await sql`SELECT location_id FROM transactions
      WHERE location_id = ${location_id}`;

      const profiles = await sql`SELECT work_location FROM profiles
      WHERE work_location = ${location_id}`

      return transactions.length + profiles.length;
    } catch(e) {
      console.log("Error looking through profiles and transactions", e);
      return null;
    }
  },

  /**
   * @function getMapData()
   * 
   * @brief   This function returns the tip amount and location (latitude and longitude) of all the
   *          tips currently in the db.
   * 
   * @returns {}
   * 
   * @example
   *      await getMapData()
   */
  getMapData: async() => { // Testing, refining needed
    try {
      const data = await sql`SELECT tip_amount, lat, lng 
      FROM transactions, locations
      WHERE locations.location_id = transactions.location_id`;

      return data;
    } catch (e) {
      console.log("Error getting data for heatmap", e);
      return [];
    }
  },
};
