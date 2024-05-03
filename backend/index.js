import express from "express";
import cors from "cors";
import userRouter from "./userRouter.js";
import contentRouter from "./contentRouter.js";
import db from "./Connection.js";

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use('/content', contentRouter);

let server; 

async function startServer() {
    try {
        await db.connect();
        server = app.listen(PORT, () => {
            console.log(`Started backend server on port ${PORT}`);
        });

        const handleShutdown = async (signal) => {
            console.log(`Received ${signal}. Closing server...`);
            try {
                await db.disconnect(); 
                server.close(() => {
                    console.log("Server closed");
                    process.exit(0); 
                });
            } catch (err) {
                console.error(`Error during server shutdown: ${err}`);
                process.exit(1);
            }
        };

        process.on('SIGINT', handleShutdown);
        process.on('SIGTERM', handleShutdown);

        process.on('unhandledRejection', (reason, promise) => {
            console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
            handleShutdown('unhandledRejection');
        });

        process.on('uncaughtException', (err) => {
            console.error(`Uncaught Exception: ${err}`);
            handleShutdown('uncaughtException');
        });

    } catch (err) {
        console.error(`Error starting the server: ${err}`);
        process.exit(1); 
    }
}

startServer();