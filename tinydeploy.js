#!/usr/bin/env node
"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config.json");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

process.env.PORT = process.env.PORT || 3037;

const log = req => {
  console.log(new Date(), req.header("user-agent"), req.url);
};

app.get("/deploy", (req, res) => {
  log(req);
  console.log(config.scripts);
  config.scripts.map(async script => {
    await exec(script, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      }
      if (stderr) {
        console.error(stderr);
      }
      console.log(stdout);
    });
  });

  res.header("Content-Type", "application/json");
  res.status(200);
  res.send(`{"status":"ok"}`);
});

app.get("/ping", (req, res) => {
  log(req);
  res.header("Content-Type", "application/json");
  res.status(200);

  res.send(`{"status":"pong"}`);
});

app.all("*", (req, res) => {
  log(req);
  res.header("Content-Type", "application/json");
  res.status(404);
  res.send(`{"status":"not found"}`);
});

const port = process.env.PORT;
module.exports = app.listen(port, () => {
  console.log(`tinydeploy started
env: 
  PORT=${process.env.PORT}
`);
});
