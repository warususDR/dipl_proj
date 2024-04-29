import express from "express";
import cors from "cors";

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

async function startServer() {
    app.listen(PORT, console.log(`Started backend server on port ${PORT}`));
}

startServer();