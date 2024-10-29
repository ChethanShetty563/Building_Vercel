import fs from "fs";
import AWS, { S3 } from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: "",
  secretAccessKey:
    "",
  endpoint: "",
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  region: "auto",
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "vercel-bucket",
      Key: fileName,
    })
    .promise();
  console.log(response);
};
