import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { AuthRequestBody, ProfileReqBody } from "./models/models";
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
