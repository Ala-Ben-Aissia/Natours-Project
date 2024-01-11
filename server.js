const app = require("./app");
const http = require("http");
const loadTours = require("./utils/loadTours");
const mongoConnect = require("./utils/mongoConnect");

const PORT = 3000;

const server = http.createServer(app);

const startServer = async () => {
	await mongoConnect();
	await loadTours();
	server.listen(PORT, () => {
		console.log("Listening on port 3000 👂");
	});
};

startServer();
