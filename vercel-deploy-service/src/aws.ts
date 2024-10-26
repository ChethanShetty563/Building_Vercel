import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const s3 = new S3Client({
  credentials: {
    accessKeyId: "2b6603d3001c50bc74e8397ed6932824",
    secretAccessKey:
      "c7b5a9d68b3d1dbbda7a52584e67b253f66abca0638c54a00135690f16865bba",
  },
  endpoint: "https://58ffbe702fdceddb387f04368b61dfd2.r2.cloudflarestorage.com",
  region: "auto",
});

export const downloadS3Folder = async (prefix: string) => {
  try {
    const command = new ListObjectsCommand({
      Bucket: "vercel-bucket",
      Prefix: prefix,
    });
    const response = await s3.send(command);

    const allPromises =
      response.Contents?.map(async ({ Key }) => {
        return new Promise(async (resolve) => {
          if (!Key) {
            resolve("");
            return;
          }
          const finalOutputpath = path.join(__dirname, Key);
          const outputFile = fs.createWriteStream(finalOutputpath);
          const dirName = path.dirname(finalOutputpath);
          if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
          }

          const getCommand = new GetObjectCommand({
            Bucket: "vercel-bucket",
            Key,
          });

          const getObjectResponse = await s3.send(getCommand);
          if (getObjectResponse.Body) {
            const readableStream =
              getObjectResponse.Body as NodeJS.ReadableStream;
            readableStream.pipe(outputFile).on("finish", () => {
              resolve("");
            });
          } else {
            resolve(""); // If Body is not present, resolve the promise
          }
        });
      }) || [];
    console.log("Awaiting downloads...");

    // Wait for all downloads to complete
    await Promise.all(allPromises);
    console.log("All files downloaded successfully.");
  } catch (error) {
    console.error("Error downloading S3 folder:", error);
  }
};

export function copyFinalDist(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/build`);
  const allFiles = getAllFiles(folderPath);
  allFiles.forEach((file) => {
    const relativePath = file.slice(folderPath.length + 1).replace(/\\/g, "/");

    console.log(`Relative path ==> dist/${id}/` + relativePath);
    uploadFile(`dist/${id}/` + relativePath, file);
  });
}

const getAllFiles = (folderPath: string) => {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};

const uploadFile = async (fileName: string, localFilePath: string) => {
  // Read the file content
  const fileContent = fs.readFileSync(localFilePath);

  // Create the upload command
  const uploadParams = {
    Bucket: "vercel-bucket", // Your S3 bucket name
    Key: fileName, // The file name to be used in S3
    Body: fileContent,
  };

  try {
    // Upload the file using PutObjectCommand
    const command = new PutObjectCommand(uploadParams);
    const response = await s3.send(command);
    console.log("File uploaded successfully:", response);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};
