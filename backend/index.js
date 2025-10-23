import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma, { connectDatabase,disconnectDatabase } from "./src/db/config.js";
import entryRoute from "./src/routes/entryRoute.js"
import authRoute from "./src/routes/authRoute.js";
import getSlotRoutes from "./src/routes/getSlotRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import attachSocketIO from "./src/middlewares/socketMiddleware.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:"*", methods: ["GET", "POST"], credentials: true
  }
});
app.use(cors());
app.use(express.json());


app.get("/", (req, res) =>{
    res.send("hi");
});
await connectDatabase();

const userConnections = new Map();

io.use((socket, next)=>{
    const rollno = socket.handshake.query.roll_no;
    console.log("Socket attempting connection with roll number:", rollno);
    if(!rollno){
        return next(new Error("roll number is required"));
    }

    socket.roll_no = rollno;
    next();
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.roll_no} (Socket ID: ${socket.id})`);
  
  userConnections.set(socket.roll_no.toString(), socket.id);
  socket.join(socket.roll_no.toString());
  
  socket.emit('connection_confirmed', {
    roll_no: socket.roll_no,
    timestamp: Date.now()
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.roll_no}`);
    userConnections.delete(socket.roll_no.toString());
  });
});

app.use(attachSocketIO(io, userConnections));

app.use("/library", entryRoute);
app.use("/library", authRoute);
app.use("/library", getSlotRoutes);

app.get("/library/ws-status", (req, res) => {
  res.json({
    status: "active",
    connectedUsers: req.userConnections.size,
    timestamp: Date.now()
  });
});

process.on("SIGINT", async () => {
  io.close(() => {
    console.log("All WebSocket connections closed");
    disconnectDatabase();
  });
});


process.on("SIGTERM", async () => {
  io.close(() => {
    console.log("All WebSocket connections closed");
    disconnectDatabase();
  });
});


server.listen(process.env.PORT, ()=>{
    console.log(`server listening on port ${process.env.PORT}`)
});