import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma, { connectDatabase,disconnectDatabase } from "./src/db/config.js";
import entryRoute from "./src/routes/entryRoute.js"
import authRoute from "./src/routes/authRoute.js";
import getSlotRoutes from "./src/routes/getSlotRoutes.js";
import { createServer } from "http";
import { WebSocketServer } from 'ws';

dotenv.config();
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(cors());
app.use(express.json());


app.get("/", (req, res) =>{
    res.send("hi");
});
await connectDatabase();

const userConnections = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const rollno = url.searchParams.get('roll_no');
  
  if (!rollno) {
    ws.close(1008, 'roll number is required');
    return;
  }

  ws.roll_no = rollno;
  console.log(`User connected: ${ws.roll_no}`);
  
  userConnections.set(rollno.toString(), ws);
  
  // ws.send(JSON.stringify({
  //   type: 'connection_confirmed',
  //   data: {
  //     roll_no: rollno,
  //     timestamp: Date.now()
  //   }
  // }));

  ws.on('error', (error) => {
    console.error(`WebSocket error for ${ws.roll_no}:`, error);
  });
  
  ws.on('close', () => {
    console.log(`User disconnected: ${ws.roll_no}`);
    userConnections.delete(rollno.toString());
  });
});

const attachWebSocket = (userConnections) => {
  return (req, res, next) => {
    req.userConnections = userConnections;
    next();
  };
};


app.use(attachWebSocket(userConnections));

app.use("/test/library/api", entryRoute);
app.use("/test/library/api", authRoute);
app.use("/test/library/api", getSlotRoutes);


app.get("/library/ws-status", (req, res) => {
  res.json({
    status: "active",
    connectedUsers: req.userConnections.size,
    timestamp: Date.now()
  });
});

process.on("SIGINT", async () => {
  wss.close(() => {
    console.log("All WebSocket connections closed");
    disconnectDatabase();
  });
});


process.on("SIGTERM", async () => {
  wss.close(() => {
    console.log("All WebSocket connections closed");
    disconnectDatabase();
  });
});


server.listen(process.env.PORT, ()=>{
    console.log(`server listening on port ${process.env.PORT}`)
});