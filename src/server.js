const http = require("http");

require("dotenv").config();

const app = require("./app");
const connectDB = require("./db");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`server running on port ${PORT}...`);
    });
}

startServer();
