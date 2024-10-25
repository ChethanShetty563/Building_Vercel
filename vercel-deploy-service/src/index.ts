import { commandOptions, createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

const subscriber = createClient();
subscriber.connect();

async function main() {
  while (1) {
    const response = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      10 * 1000
    );
    const id = response?.element;

    if (id) {
      // await downloadS3Folder(`output/${id}`);
      // await buildProject(id);
      copyFinalDist(id);
    }
  }
}

main();
