import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma, { connectDatabase,disconnectDatabase } from "./db/config.js";
import entryRoute from "./routes/entryRoute.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

await connectDatabase();

app.use("/api/", entryRoute);


app.get("/", (req, res)=>{
    res.send("Hi there");
});

process.on("SIGINT", disconnectDatabase);
process.on("SIGTERM", disconnectDatabase);
app.listen(process.env.PORT, ()=>{
    console.log(`server listening on port ${process.env.PORT}`)
});