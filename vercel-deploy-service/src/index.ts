import { commandOptions, createClient } from "redis";

const subscriber = createClient();
subscriber.connect();

async function main() {
  while (1) {
    const response = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      10 * 1000
    );
    console.log(response);
  }
}

main();
