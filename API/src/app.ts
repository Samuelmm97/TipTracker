import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { AuthRequestBody } from "./models/models";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";

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

  let result = await utils.addTip(body, params.amount);
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
