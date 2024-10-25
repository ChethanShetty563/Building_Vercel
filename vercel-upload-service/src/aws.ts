import fs from "fs";
import AWS, { S3 } from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: "2b6603d3001c50bc74e8397ed6932824",
  secretAccessKey:
    "c7b5a9d68b3d1dbbda7a52584e67b253f66abca0638c54a00135690f16865bba",
  endpoint: "https://58ffbe702fdceddb387f04368b61dfd2.r2.cloudflarestorage.com",
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
