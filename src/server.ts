import app from "./app.js";
import config from "./config/index.js";
import {prisma} from "./lib/prisma.js";

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();



export default app;
