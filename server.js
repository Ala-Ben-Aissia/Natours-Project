/* eslint-disable no-console */
const app = require("./app");
const http = require("http");
const mongoConnect = require("./utils/mongoConnect");
require("./data/importData");
require("./data/deleteData");

const { PORT } = process.env;
const server = http.createServer(app);
const startServer = async () => {
   await mongoConnect();
   server.listen(PORT, () => {
      console.log("Listening on port 3000 👂");
   });
};

// * for synchronous operations
process.on("uncaughtException", (error, origin) => {
   console.log("❌ UNCAUGHT EXCEPTION Shutting down...");
   console.log("⛔️ ERROR ⛔️: %s: %s", error.name, error.message);
   console.log("⛔️ ORIGIN ⛔️: %s", origin);
});

// * for asynchronous operations
process.on("unhandledRejection", (reason, promise) => {
   console.log("❌ UNHANDLED REJECTION Shutting down... ❌");
   console.log("⛔️ REASON ⛔️: %s: %s", reason.name, reason.message);
   console.log("⛔️ PROMISE ⛔️: %s", promise);
   server.close(() => {
      process.exit();
   });
});

startServer();
