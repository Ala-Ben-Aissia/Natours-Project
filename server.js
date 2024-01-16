const app = require("./app");
const http = require("http");
const mongoConnect = require("./utils/mongoConnect");
require("./data/importData");
require("./data/deleteData");

const PORT = 3000;

const server = http.createServer(app);
const startServer = async () => {
	await mongoConnect();
	server.listen(PORT, () => {
		console.log("Listening on port 3000 👂");
	});
};

startServer();
