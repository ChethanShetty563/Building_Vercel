import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFilesPathById } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
const subscriber = createClient();
publisher.connect();
subscriber.connect();

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
  publisher.hSet("status", id, "uploaded");

  res.json({ id: id });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(3000, () => {
  console.log("Server started!");
});
