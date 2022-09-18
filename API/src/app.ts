import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { AuthRequestBody } from "./models/models";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";
import * as jwt from "jsonwebtoken";

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

  let token = jwt.sign({ user: body }, JWT_SECRET);

  res.status(200).send(token);
});

app.post("/login", async (req, res) => {
  const body: AuthRequestBody = req.body;

  let result = await utils.login(body);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  let token = jwt.sign({ user: body }, JWT_SECRET);
  res.send(token);
});

app.listen(port, async () => {
  await utils.connectDB();
  return console.log(`Express is listening at http://localhost:${port}`);
});
