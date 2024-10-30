import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const { Readable } = require("stream");

const app = express();
const s3 = new S3Client({
  credentials: {
    accessKeyId: "",
    secretAccessKey:
      "",
  },
  endpoint: "",
  region: "auto",
});

app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path;
  console.log(host);
  console.log(filePath);
  console.log(`dist/${id}${filePath}`);

  const command = new GetObjectCommand({
    Bucket: "vercel-bucket",
    Key: `dist/${id}${filePath}`,
  });
  const response = await s3.send(command);

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);
  // Convert the S3 response body into a Node.js readable stream
  const readableStream = Readable.from(response.Body);

  // Stream the data directly to the response
  readableStream.pipe(res);
});

app.listen(3002, () => {
  console.log("Server Started!");
});
