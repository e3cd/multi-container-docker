const keys = require("./keys");

//Express Setup
const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//Postgres Client setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on("error", () => console.log("Lost PG connection"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

//Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

//Express Route Handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

//query running pg instances and retrieve all different values submitted to pg, make a sql query to pg, send rows back to user

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

//query redis, retrieve all indices that have been requested and return calculated values for indices. Redis does not support async await, have to use cb

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

//query express from react

app.post("/values", async (req, res) => {
  const index = req.body.index;

  //cap size of user input
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  //input into redis store, will replace nothing yet with value
  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);

  //take submitted index and store into pg as array
  pgClient.query("INSERT INTO values (number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log("Listening");
});
