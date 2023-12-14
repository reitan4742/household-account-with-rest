"use strict";
import express from "express";
const app: express.Express = express();
const port = 8080;

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("hello world");
});

app.listen(port);