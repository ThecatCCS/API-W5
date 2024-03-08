import express from "express";
import bodyParser from "body-parser";
import {router as movie} from "./api/movie";
import {router as people} from "./api/people";
import cors from "cors";
export const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use(
    cors({
      origin: "*",
    })
  );


app.use("/", movie);
app.use("/p", people);
