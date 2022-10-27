import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { AuthRequestBody, ProfileReqBody } from "./models/models";
import { Query } from "express-serve-static-core";
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

app.post("/tip", verifyJWT, async (req, res) => {
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

app.get("/tip", async (req, res) => {
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

app.delete("/tip", verifyJWT, async (req, res) => {
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

app.patch("/tip", verifyJWT, async (req, res) => {
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

app.listen(port, async () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
