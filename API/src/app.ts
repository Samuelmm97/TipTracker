import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Query } from "express-serve-static-core";
import { AuthRequestBody } from "./models/models";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";
import * as jwt from "jsonwebtoken";
import { verifyJWT } from "./utils/jwt";
var format = require("date-fns/format");

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

  await utils.registerUser(body);
  const token = jwt.sign({ email: body.email }, JWT_SECRET, {expiresIn: "15m"});
  const refreshToken = jwt.sign({_id: body.email}, REFRESH_JWT_SECRET, {expiresIn: "7d"});

  res.header("auth-token", token);
  res.header("refresh-token", refreshToken);

  res.status(201).send({message: "Registration successful"});
} catch (error) {
  console.log(error);
  res.status(500).send({message: error});
}
});

app.post("/login", async (req, res) => {
  try {
    const body: AuthRequestBody = req.body;

  let result = await utils.login(body);

  if (!result) {
    res.status(400).send({message: "Login failed: Invalid username/password"});
    return;
  }

  const token = jwt.sign({ email: body.email }, JWT_SECRET, {expiresIn: "15m"});
  const refreshToken = jwt.sign({_id: body.email}, REFRESH_JWT_SECRET, {expiresIn: "7d"});

  res.header("auth-token", token);
  res.header("refresh-token", refreshToken);

  res.status(200).send({message: "Login successful"});
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

  app.post("/tip", verifyJWT, async (req, res) => {
    try {
      const body: AuthRequestBody = req.body;
      const params: Query = req.query;
      let amount: string = "" + params.amount;
  
      let result = await utils.addTip(body, amount);
  
      if (!result) {
        res.send(400).send({message: "Error adding tip into the system"});
        return;
      }
      res.status(200).send({message: "Tip entry added"});
    } catch (error) {
      console.log(error);
      res.status(500).send({message: error});
    }
});

app.get("/tip", async (req, res) => {
  try {
    const body: AuthRequestBody = req.body;
    const params: Query = req.query;
    let period: number = +("" + params.period);

    let result = await utils.getTips(body, period);

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

app.delete("/tip", verifyJWT, async (req, res) => {
  try {
  const body: AuthRequestBody = req.body;
  const params: Query = req.query;
  let id: number = +("" + params.id);

  let result = await utils.deleteTip(body, id);

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

app.patch("/tip", verifyJWT, async (req, res) => {
  try {
    const body: AuthRequestBody = req.body;
    const params: Query = req.query;
    let id: number = +("" + params.id);
    let value: string = "" + params.value;

    let result = await utils.updateTip(body, id, value);

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

app.listen(port, async () => {
  await utils.connectDB();
  return console.log(`Express is listening at http://localhost:${port}`);
});
