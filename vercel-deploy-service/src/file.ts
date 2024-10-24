import fs from "fs";
import path from "path";

export function getAllFilesPathById(folderPath: string) {
  let response: string[] = [];
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFilesPathById(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });

  return response;
}
