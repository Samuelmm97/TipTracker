import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Query } from "express-serve-static-core";
import { AuthRequestBody, VehiclePatchMode, LocationPatchMode } from "./models/models";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";
import * as jwt from "jsonwebtoken";
import { verifyJWT } from "./utils/jwt";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;
const JWT_SECRET: string = process.env.JWT_SECRET ?? "";
if (JWT_SECRET === "") {
  console.log("JWT_SECRET REQUIRED");
  process.exit(0);
}

app.post("/register", async (req, res) => {
  const body: AuthRequestBody = req.body;

  await utils.registerUser(body);

  const token = jwt.sign({ email: body.email }, JWT_SECRET, {
    expiresIn: "15m",
  });

  res.status(200).send(token);
});

app.post("/login", async (req, res) => {
  const body: AuthRequestBody = req.body;

  let result = await utils.login(body);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  const token = jwt.sign({ email: body.email }, JWT_SECRET, {
    expiresIn: "15m",
  });
  res.send(token);
});

app.post("/transaction", verifyJWT, async (req, res) => {
  const body: AuthRequestBody = req.body;
  const params: Query = req.query;
  let amount: string = "" + params.amount;

  let result = await utils.addTip(body, amount);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.get("/ttransaction", async (req, res) => {
  const body: AuthRequestBody = req.body;
  const params: Query = req.query;
  let period: number = +("" + params.period);

  let result = await utils.getTips(body, period);

  if (!result) {
    res.sendStatus(400);
    return;
  }

  res.send(result);
});

app.delete("/transaction", verifyJWT, async (req, res) => {
  const body: AuthRequestBody = req.body;
  const params: Query = req.query;
  let id: number = +("" + params.id);

  let result = await utils.deleteTip(body, id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/transaction", verifyJWT, async (req, res) => {
  const body: AuthRequestBody = req.body;
  const params: Query = req.query;
  let id: number = +("" + params.id);
  let value: string = "" + params.value;

  let result = await utils.updateTip(body, id, value);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

// TODO: Add crud methods for other tables such as vehicle, profile, account, etc.
app.post("/vehicle", verifyJWT, async(req, res) => {
  const params: Query = req.query;

  let id: number = +(""+params.id);
  let cost2Own: number = +(""+params.cost);
  let make: string = "" + params.make;
  let model: string = "" + params.model;
  let year: number = +(""+params.year);

  let result = await utils.addVehicle(id, cost2Own, make, model, year);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.get("/vehicle", async(req, res) => {
  const params: Query = req.query;
  let id: number = +(""+params.id);
  
  let result = await utils.getVehicle(id);

  if (!result) {
    res.sendStatus(400);
    return;
  }

  res.send(result);
});

app.delete("/vehicle", verifyJWT, async(req, res) => {
  const params: Query = req.query;
  let id: number = +(""+params.id);

  let result = await utils.deleteVehicle(id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/vehicle", verifyJWT, async(req, res) => {
  const params: Query = req.query;
  let mode: VehiclePatchMode = +(""+params.mode);
  let id: number = +(""+params.id);
  let value: string = ""+params.value;

  let result = await utils.patchVehicle(mode, id, value);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.post("/location", verifyJWT, async(req, res) => {
  const params: Query = req.query;

  let address1: string = ""+params.address1;
  let address2: string = ""+params.address2;
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
  let id: number = +(""+params.id);

  let result = await utils.getLocation(id);

  if (!result) {
    res.sendStatus(400);
    return;
  }

  res.send(result);
});

app.delete("/location", verifyJWT, async(req, res) => {
  const params: Query = req.query;
  let id: number = +(""+params.id);

  let result = await utils.deleteLocation(id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/location", verifyJWT, async(req, res) => {
  const params: Query = req.query;
  let mode: LocationPatchMode = +(""+params.mode);
  let id: number = +(""+params.id);
  let value: string = ""+params.value;

  let result = await utils.patchLocation(mode, id, value);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.listen(port, async () => {
  await utils.connectDB();
  return console.log(`Express is listening at http://localhost:${port}`);
});
