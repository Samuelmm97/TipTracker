import * as dotenv from "dotenv";
dotenv.config();
console.log(process.env.POSTGRES_USER);
import express from "express";
import { AuthRequestBody } from "./models/models";
import { utils } from "./utils/postgres";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 2994;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  const body: AuthRequestBody = req.body;
  console.log(body);

  await utils.registerUser(body);

  res.status(200).send({ success: true });
});

app.post("/login", async (req, res) => {
  const body: AuthRequestBody = req.body;

  let result = await utils.login(body);
  if (!result || result !== "SELECT 1") {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.listen(port, async () => {
  await utils.connectDB();
  return console.log(`Express is listening at http://localhost:${port}`);
});

let wasCleanedUp = false;

const runBeforeExiting = (fun: Function) => {
  const exitSignals = [
    "exit",
    "SIGINT",
    "SIGUSR1",
    "SIGUSR2",
    "uncaughtException",
  ];
  for (const signal of exitSignals) {
    process.on(signal as any, async () => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!wasCleanedUp && signal !== "exit") {
        await fun();
        wasCleanedUp = true;
      }
      process.exit(0);
    });
  }
};

// runBeforeExiting(async () => {
//   console.log("server closing...");
//   await utils.disconnect();
//   return null;
// });
