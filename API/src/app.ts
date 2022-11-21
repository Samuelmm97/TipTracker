import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { AuthRequestBody, ProfileReqBody, VehiclePatchMode, LocationPatchMode } from "./models/models";
import { Query } from "express-serve-static-core";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";
const jwt = require("jsonwebtoken");
import { verifyJWT } from "./utils/jwt";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;
const JWT_SECRET: string = process.env.JWT_SECRET ?? "";
const REFRESH_JWT_SECRET: string = process.env.REFRESH_JWT_SECRET ?? "";

if (JWT_SECRET === "") {
  console.log("JWT_SECRET REQUIRED");
  process.exit(0);
}

if (REFRESH_JWT_SECRET === "") {
  console.log("JWT_SECRET REQUIRED");
  process.exit(0);
}

app.post("/register", async (req, res) => {
  try {
  const body: AuthRequestBody = req.body;

  const result = await utils.registerUser(body);
  if (result != null) {
    throw result;
  }

  const token = jwt.sign({ email: body.email }, JWT_SECRET, {expiresIn: "15m"});
  const refreshToken = jwt.sign({email: body.email}, REFRESH_JWT_SECRET, {expiresIn: "7d"});

  res.header("auth-token", token);
  res.header("refresh-token", refreshToken);

  // TODO: Get user id from database
  res.status(201).send({message: "Registration successful."});
} catch (error) {
  console.log(error);
  res.status(500).send({message: String(error)});
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

  res.header("auth-token", token);
  res.header("refresh-token", refreshToken);

  res.status(200).send({message: "Login successful."});
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
  const token: string = req.header("auth-token") ?? "";
  let amt: number = req.body.amount;

  if (token === "") {
    res.status(401).send({message: "Unauthorized"});
  }

  let result = await utils.addTip(jwt.decode(token)["email"], amt);

  if (!result) {
    res.status(400).send({message: "Error adding tip into the system."});
    return;
  }
  res.status(200).send({message: "Tip entry added."});
});

app.get("/transaction/:id", verifyJWT, async (req, res) => {
  try {
    const auth_token = req.headers["auth-token"];
    const { id } = req.params;


    let result = await utils.getTips(jwt.decode(auth_token)["email"], +id);

    if (!result) {
      res.status(404).send({message: "Tip entry does not exist."});
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
    const { id } = req.params;

    let result = await utils.deleteTip(+id);

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
    const {id} = req.params;
    let value: number = body.value;

    let result = await utils.updateTip(+id, value);

    if (!result) {
      res.status(404).send({message: "Tip entry does not exist."});
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

  let result = await utils.onboarding(body);
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
  const params: Query = req.query;

  let profile_id: number = +(""+params.profile_id);
  let cost2Own: number = +(""+params.cost_to_own);
  let make: string = "" + params.make;
  let model: string = "" + params.model;
  let year: number = +(""+params.year);

  let result = await utils.addVehicle(profile_id, cost2Own, make, model, year);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.get("/vehicle", async(req, res) => {
  const params: Query = req.query;
  let profile_id: number = +(""+params.profile_id);
  
  let result = await utils.getVehicle(profile_id);

  if (!result) {
    res.sendStatus(400);
    return;
  }

  res.send(result);
});

app.delete("/vehicle", verifyJWT, async(req, res) => {
  const params: Query = req.query;
  let vehicle_id: number = +(""+params.vehicle_id);

  let result = await utils.deleteVehicle(vehicle_id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/vehicle", verifyJWT, async(req, res) => {
  const params: Query = req.query;
  const body = req.body;
  let vehicle_id: number = +(""+params.vehicle_id);

  let result = await utils.patchVehicle(vehicle_id, body);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.post("/location", verifyJWT, async(req, res) => {
  const params: Query = req.query;

  let address1: string = ""+params.address_1;
  let address2: string = ""+params.address_2;
  let city: string = ""+params.city;
  let state: string = ""+params.state;
  let zip_code: string = ""+params.zip_code;

  let result = await utils.addLocation(address1, address2, city, state, zip_code);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.get("/location", async(req, res) => {
  const params: Query = req.query;
  let location_id: number = +(""+params.location_id);

  let result = await utils.getLocation(location_id);

  if (!result) {
    res.sendStatus(400);
    return;
  }

  res.send(result);
});

app.delete("/location", verifyJWT, async(req, res) => {
  const params: Query = req.query;
  let location_id: number = +(""+params.location_id);

  let result = await utils.deleteLocation(location_id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/location", verifyJWT, async(req, res) => {
  const params: Query = req.query;
  const body = req.body;
  let location_id: number = +(""+params.location_id);

  let result = await utils.patchLocation(location_id, body);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.listen(port, async () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
