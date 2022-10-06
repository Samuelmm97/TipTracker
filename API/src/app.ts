import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Query } from 'express-serve-static-core';
import { AuthRequestBody } from "./models/models";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";
var format = require('date-fns/format')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;

app.post("/register", async (req, res) => {
  const body: AuthRequestBody = req.body;

  await utils.registerUser(body);

  res.status(200).send({ success: true });
});

app.post("/login", async (req, res) => {
  const body: AuthRequestBody = req.body;

  let result = await utils.login(body);
  
  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.post("/tip", async(req, res) => {
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

app.get("/tip", async(req, res) => {
  const body: AuthRequestBody = req.body;
  const params: Query = req.query;
  let period: number = +(""+params.period);

  let result = await utils.getTips(body, period);

  if (!result) {
    res.sendStatus(400);
    return;
  }

  res.send(result);
});

app.delete("/tip", async(req, res) => {
  const body: AuthRequestBody = req.body;
  const params: Query = req.query;
  let id: number = +(""+params.id);

  let result = await utils.deleteTip(body, id);

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/tip", async(req, res) => {
  const body: AuthRequestBody = req.body;
  const params: Query = req.query;
  let id: number = +(""+params.id);
  let value: string = "" + params.value;

  let result = await utils.updateTip(body, id, value);

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
