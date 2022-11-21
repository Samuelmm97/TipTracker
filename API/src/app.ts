import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { AuthRequestBody, ProfileReqBody } from "./models/models";
import { Query } from "express-serve-static-core";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";
import * as jwt from "jsonwebtoken";
import { verifyJWT } from "./utils/jwt";
import { email } from "./utils/email";
import { compareSync } from "bcrypt";
var format = require("date-fns/format");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT ?? 3000;
const JWT_SECRET: string = process.env.JWT_SECRET ?? "";
const REFRESH_JWT_SECRET: string = process.env.REFRESH_JWT_SECRET ?? "";
const EMAIL_SECRET: string = process.env.EMAIL_JWT_SECRET ?? "";

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
  const verifyToken = jwt.sign({ id: user_id }, EMAIL_SECRET, {expiresIn: "1d"});
  const mail = await email.sendVerification(body.email, user_id, verifyToken);

  const token = jwt.sign({ email: body.email }, JWT_SECRET, {expiresIn: "15m"});
  const refreshToken = jwt.sign({_id: body.email}, REFRESH_JWT_SECRET, {expiresIn: "7d"});

  res.header("auth-token", token);
  res.header("refresh-token", refreshToken);

  res.status(201).send({message: "Registration successful"});
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

  if (result != null) {
    res.status(400).send({message: "Login failed: " + result});
    return;
  }

  const token = jwt.sign({ email: body.email }, JWT_SECRET, {expiresIn: "15m"});
  const refreshToken = jwt.sign({_id: body.email}, REFRESH_JWT_SECRET, {expiresIn: "7d"});

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
})

app.post("/transaction", verifyJWT, async (req, res) => {
  const body = req.body;
  let amount: string = body.amount;
  const address = body.address;

  let location_id = null;
  if (body.address != null) {
    console.log("searching in db");
    location_id = await utils.searchLocation(body.address);
    if (location_id == null) {
      console.log("Adding location");
      location_id = await utils.addLocation(address.address_1, address.address_2, address.city, address.state, address.zip_code);
    }
  } else if (body.location_id != null) {
    location_id = body.location_id;
  }

  console.log("Adding tip", typeof location_id, location_id);
  let result = await utils.addTip(amount, body.user_id, location_id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.get("/transaction", async (req, res) => {
  try {
    const body = req.body;
    let userId: number = body.userId;
    let period: number = body.period;

      let result = await utils.getTips(userId, period);

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

app.delete("/transaction", verifyJWT, async (req, res) => {
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

app.patch("/transaction", verifyJWT, async (req, res) => {
  try {
    const body = req.body;
    let transaction_id: number = body.transaction_id;
    let location_id: number = body.location_id;
    let address = body.address;

    if (address != null)  {
      let uses = await utils.locationUses(location_id);
      if (uses == 1) {
        await utils.patchLocation(location_id, address);
      } else {
        let search = await utils.searchLocation(address);
        if (search != null) {
          location_id = search.id;
        } else {
          location_id = await utils.addLocation(address.address_1, address.address_2, address.city, address.state, address.zip_code);
        }
      }
    }

    const tip = { location_id: location_id, tip_amount: body.amount };
    console.log(tip);
    let result = await utils.updateTip(transaction_id, tip);

    if (!result) {
      res.status(404).send({message: "Tip does not exist"});
      return;
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send({message: error});
  }
});

app.post("/onboarding", async (req, res) => {
  const body: ProfileReqBody = req.body;

  let result = await utils.onboarding(body);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  let result = await utils.getProfile(userId);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.send(JSON.stringify(result));
});

app.put("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const { body } = req;
  let result = await utils.updateProfile(userId, body);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
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
  res.send({ vehicle_id: result }).status(200);
});

app.get("/vehicle", async(req, res) => {
  const body = req.body;
  let profile_id: number = body.profile_id;
  
  let result = await utils.getVehicle(profile_id);

  if (!result) {
    res.sendStatus(400);
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

  let address_1: string = body.address_1;
  let address_2: string = body.address_2;
  let city: string = body.city;
  let state: string = body.state;
  let zip_code: string = body.zip_code;

  let result = await utils.addLocation(address_1, address_2, city, state, zip_code);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.send({ location_id: result }).status(200);
});

app.get("/location", async(req, res) => {
  const body = req.body;
  let location_id: number = body.location_id;

  let result = await utils.getLocation(location_id);

  if (!result) {
    res.sendStatus(400);
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

app.listen(port, async () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
