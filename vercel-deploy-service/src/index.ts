import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFilesPathById } from "./file";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
  // push this to s3
  console.log(getAllFilesPathById(path.join(__dirname, `output/${id}`)));
  res.json({ id: id });
});

app.listen(3000, () => {
  console.log("Server started!");
});
