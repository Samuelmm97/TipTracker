import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
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
  const params : any = req.query;

  let d: Date = new Date();
  let time : string = format(d, 'yyyy-MM-dd');

  let result = await utils.addTip(body, params.amount, time);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});
/*
app.get("/history", async(req, res) => {
  const body: AuthRequestBody = req.body;
  const params: any = req.query;

  let period: number = +params.period;
  let d: Date = new Date();
  d.setDate(d.getDate() - period);
  let time : string = format(d, 'yyy-MM-dd');

  let result = await utils.getTips(body, time);
  console.log(result);

  if (!result) {
    res.sendStatus(400);
    return;
  }

  // TODO: send stuff
  return res.jsonp({ names: result.names });
});*/

app.delete("/delete/tip", async(req, res) => {
  const body: AuthRequestBody = req.body;
  const params: any = req.query;
  let id: number = +params.id;

  let result = await utils.deleteTip(body, id);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.patch("/update/tip", async(req, res) => {
  const body: AuthRequestBody = req.body;
  const params: any = req.query;
  let id: number = +params.id;
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
