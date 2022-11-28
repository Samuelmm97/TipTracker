import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Address, AuthRequestBody, latlng, ProfileReqBody } from "./models/models";
import { Query } from "express-serve-static-core";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";
const jwt = require("jsonwebtoken");
import { verifyJWT } from "./utils/jwt";
import { geo } from "./utils/geo";
import { email } from "./utils/email";
import { compareSync } from "bcrypt";
import { LatLngLiteral } from "@googlemaps/google-maps-services-js";
var format = require("date-fns/format");

const DEBUG = true;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT ?? 3000;
const JWT_SECRET: string = process.env.JWT_SECRET ?? "";
const REFRESH_JWT_SECRET: string = process.env.REFRESH_JWT_SECRET ?? "";
const EMAIL_SECRET: string = process.env.EMAIL_SECRET ?? "";

if (JWT_SECRET === "") {
  console.log("JWT_SECRET REQUIRED");
  process.exit(0);
}

if (REFRESH_JWT_SECRET === "") {
  console.log("JWT_SECRET REQUIRED");
  process.exit(0);
}

if (EMAIL_SECRET === "") {
  console.log("EMAIL_SECRET REQUIRED");
  process.exit(0);
}


app.post("/register", async (req, res) => {
  try {
  const body: AuthRequestBody = req.body;

  const result = await utils.registerUser(body);
  if (typeof result !== "number") {
    console.log(typeof result);
    throw result;
  }
  
  let user_id = result;
  const verifyToken = jwt.sign({ _id: user_id }, EMAIL_SECRET, {expiresIn: "1d"});
  // const mail = await email.sendVerification(body.email, user_id, verifyToken);

  const token = jwt.sign({ _id: user_id }, JWT_SECRET, {expiresIn: "15m"});
  const refreshToken = jwt.sign({_id: user_id}, REFRESH_JWT_SECRET, {expiresIn: "7d"});

  res.header("auth-token", token);
  res.header("refresh-token", refreshToken);

  // TODO: Get user id from database
  res.status(201).send({message: "Registration successful.", data: {user_id: user_id}});
} catch (error) {
  console.log(error);
  res.status(500).send({message: String(error)});
}
});

app.get("/verify/:user_id/:token", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { token } = req.params;

    const decoded = jwt.verify(token, EMAIL_SECRET);
    const result = await utils.verifyUser(+user_id);

    res.status(200).send("Account successfully verified!");
  } catch(e) {
    console.log(e);
    res.status(500).send("Couldn't verify account :(");
  }
});

app.post("/login", async (req, res) => {
  try {
    const body: AuthRequestBody = req.body;

    let result = await utils.login(body);

    if (!result) {
      res.status(401).send({message: "Login failed: Invalid username/password."});
      return;
    }

    const token = jwt.sign({ email: body.email }, JWT_SECRET, {expiresIn: "15m"});
    const refreshToken = jwt.sign({ email: body.email}, REFRESH_JWT_SECRET, {expiresIn: "7d"});

    const account = await utils.getAccount(body);
    if (account == null) {
      throw new Error("Couldn't find account");
    }
    console.log(account);

    res.header("auth-token", token);
    res.header("refresh-token", refreshToken);


    res.status(200).send({message: "Login successful", user_id: account.id, profile_id: account.profile_id});

  } catch (error) {
    console.log(error);
    res.status(500).send({message: error});
  }
});

app.get("/verify_token", verifyJWT, async (req, res) => {
  try {
    res.status(200).send({message: "Token verified"});
  } catch (error) {
    res.status(500).send({message: error});
  }
});

app.post("/transaction", verifyJWT, async (req, res) => {

  const body = req.body;
  let amount: string = body.amount;
  const address: Address = body.address;
  const miles_driven: number = body.miles_driven;

  let location_id = null;
  if (body.address != null) {
    console.log("searching in db");
    location_id = await utils.searchLocation(body.address);
    if (location_id == null) {
      console.log("Adding location");
      const gcd: latlng = await geo.geocode(address);
      location_id = await utils.addLocation(address, gcd);
    }
  } else if (body.location_id != null) {
    location_id = body.location_id;
  }

  console.log("Adding tip", typeof location_id, location_id);
  let result = await utils.addTip(amount, body.user_id, location_id, miles_driven);

  if (!result) {
    res.status(400).send({message: "Error adding tip into the system."});
    return;
  }
  res.status(200).send({message: "Tip entry added."});
});

app.get("/transaction/:id", verifyJWT, async (req, res) => {
  try {
    const params: Query = req.query;
    const userId: number = Number(params.userId);
    const period: number = Number(params.period);

    console.log('here');
    console.log(period);

    let result = await utils.getTips(userId, period);

    if (!result) {
      res.status(404).send({message: "Tip entry does not exist.", userId: userId, period: period, result: result});

      return;
    }

    res.status(200).send({message: "Tip entry retrieved.", data: result});
  } catch (error) {
    console.log(error);
    res.status(500).send({message: error});
  }
});

app.delete("/transaction/:id", verifyJWT, async (req, res) => {
  try {

    const body = req.body;
    let id: number = body.id;

    let result = await utils.deleteTip(id);


    if (!result) {
      res.status(404).send({message:"Tip entry does not exist."});
      return;
    }
    res.status(200).send({message: "Tip successfully deleted."});
  } catch (error) {
    console.log(error);
    res.status(500).send({message: error});
  }
});

app.patch("/transaction/:id", verifyJWT, async (req, res) => {
  try {
    const body = req.body;

    let transaction_id: number = body.transaction_id;
    let location_id: number = body.location_id;
    let address: Address = body.address;

    if (address != null)  {
      let uses = await utils.locationUses(location_id);
      if (uses == 1) {
        await utils.patchLocation(location_id, address);
      } else {
        let search = await utils.searchLocation(address);
        if (search != null) {
          location_id = search.id;
        } else {
          const gcd: latlng = await geo.geocode(address);
          location_id = await utils.addLocation(address, gcd);
        }
      }
    }

    const tip = { location_id: Number(location_id), tip_amount: body.tip_amount };
    console.log(tip);
    let result = await utils.updateTip(transaction_id, tip);


    if (!result) {
      if (DEBUG) {
        res.status(404).send({message: "Tip does not exist", result: result});
      } else {
        res.status(404).send({message: "Tip does not exist"});
      }
      return;
    }
    res.status(200).send({message: "Tip entry updated."});
  } catch (error) {
    console.log(error);
    res.status(500).send({message: error});
  }
});

app.post("/onboarding", verifyJWT, async (req, res) => {
  const body: ProfileReqBody = req.body;

  let result;
  if (body.workAddress != null) {
    const gcd: latlng = await geo.geocode(body.workAddress);
    result = await utils.onboarding(body, gcd);
  } else {
    result = await utils.onboarding(body, { lat: null, lng: null });
  }
  
  if (!result) {
    res.status(400).send({message: "Update user profile failed."});
    return;
  }
  res.status(200).send({message: "Update user profile successful."});
});

app.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  let result = await utils.getProfile(userId);

  if (!result) {
    res.status(404).send({message: "User profile not found."});
    return;
  }
  res.status(200).send({data: JSON.stringify(result), message: "User profile retrieved successfully."});
});

app.put("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const { body } = req;
  let result = await utils.updateProfile(userId, body);
  if (!result) {
    res.status(400).send({message: "User profile update failed."});
    return;
  }
  res.status(200).send({message: "User profile updated successfully."});
});

// TODO: Add crud methods for other tables such as vehicle, profile, account, etc.
app.post("/vehicle", verifyJWT, async(req, res) => {
  const body = req.body;

  let profile_id: number = body.profile_id;
  let cost_to_own: number = body.cost_to_own;
  let make: string = body.make;
  let model: string = body.model;
  let year: number = body.year;

  let result = await utils.addVehicle(profile_id, cost_to_own, make, model, year);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.status(200).send({ vehicle_id: result });
});

app.get("/vehicle", async(req, res) => {
  const params: Query = req.query;
  let profile_id: number = Number(params.profile_id);
  
  let result = await utils.getVehicle(profile_id);

  if (!result) {
    res.status(400).send({result: result, profile_id: profile_id});
    return;
  }

  res.send(result);
});

app.delete("/vehicle", verifyJWT, async(req, res) => {
  const body = req.body;
  let vehicle_id: number = body.vehicle_id;

  let result = await utils.deleteVehicle(vehicle_id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/vehicle", verifyJWT, async(req, res) => {
  const body = req.body;
  let vehicle_id: number = body.vehicle_id;

  let result = await utils.patchVehicle(vehicle_id, body);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.post("/location", verifyJWT, async(req, res) => {
  const body = req.body;
  const address: Address = {
    address_1: body.address_1,
    address_2: body.address_2,
    city: body.city,
    state: body.state,
    zip_code: body.zip_code
  };

  let gcd: latlng = await geo.geocode(address);

  let result = await utils.addLocation(address, gcd);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.status(200).send({ location_id: result });
});

app.get("/location", async(req, res) => {
  const params: Query = req.query;
  let location_id: number = Number(params.location_id);

  let result = await utils.getLocation(location_id);

  if (!result) {
    res.status(400).send({result: result, location_id: location_id});
    return;
  }

  res.send(result);
});

app.delete("/location", verifyJWT, async(req, res) => {
  const body = req.body;
  let location_id: number = body.location_id;

  let result = await utils.deleteLocation(location_id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/location", verifyJWT, async(req, res) => {
  const body = req.body;
  let location_id: number = body.location_id;

  let result = await utils.patchLocation(location_id, body);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.get("/map", async(req, res) => {
  try {
    const data = await utils.getMapData();

    res.status(200).send(data);
  } catch(e) {
    console.log(e);
    res.status(500).send([]); //is status correct?
  }
});

app.listen(port, async () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
