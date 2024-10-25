import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFilesPathById } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
  // push this to s3
  const files = getAllFilesPathById(path.join(__dirname, `output/${id}`));

  files.forEach(async (file) => {
    let relativePath = path.relative(__dirname, file);
    // Replace backslashes with forward slashes to make it S3-compatible
    relativePath = relativePath.split(path.sep).join("/");
    await uploadFile(relativePath, file);
  });

  publisher.lPush("build-queue", id);

  res.json({ id: id });
});

app.listen(3000, () => {
  console.log("Server started!");
});
