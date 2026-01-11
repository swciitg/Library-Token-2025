import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma, {
  connectDatabase,
  disconnectDatabase,
} from "./src/db/config.js";
import entryRoute from "./src/routes/entryRoute.js";
import getSlotRoutes from "./src/routes/getSlotRoutes.js";
import { errorHandler } from "./src/middlewares/error.handler.js";
import tokenRoute from "./src/routes/tokenRoute.js";
import { createServer } from "http";
import { WebSocketServer } from 'ws';
import redisClient from "./src/utils/redisClient.js";

dotenv.config();
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(cors());
app.use(express.json());


app.get(process.env.BASE_ROUTE, (req, res) =>{
    res.send("hi");
});
await connectDatabase();

const userConnections = new Map();

wss.on('connection', async (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const rollno = url.searchParams.get('roll_no');
  
  if (!rollno) {
    ws.close(1008, 'roll number is required');
    return;
  }

  ws.roll_no = rollno;
  console.log(`User connected: ${ws.roll_no}`);
  
  userConnections.set(rollno.toString(), ws);
  // to send initial entry data on connection
  try {
    const entry = await prisma.entry.findUnique({
      where: {
        roll_no: BigInt(rollno),
      },
      include: {
        slot: true,
      },
    });

    ws.send(
      JSON.stringify({
        type: "initial_entry_data",
        data: entry.slot.id ?? null,
      })
    );

    console.log("Entry data sent to", rollno);
  } catch (error) {
    console.error("DB error on connection:", error);
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Failed to load entry data.",
      })
    );
  }

  ws.on("message", async (message) => {
    console.log("RAW MESSAGE:", message.toString());

    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (e) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid JSON",
        })
      );
      return;
    }

    console.log("PARSED MESSAGE:", payload);

    if (payload.type === "ping") {
      ws.send(
        JSON.stringify({
          type: "pong",
          data: {
            timestamp: Date.now(),
          },
        })
      );
    }

    if(payload.type === 'store_token'){
      await handleStoreToken(ws, payload);
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for ${ws.roll_no}:`, error);
  });
  
  ws.on('close', () => {
    console.log(`User disconnected: ${ws.roll_no}`);
    userConnections.delete(rollno.toString());
  });
});

const handleStoreToken = async (ws, payload) => {
    try {
        const { token, roll_no } = payload.data;

        if (!token) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Token is required",
            })
          );
          return;
        }

        if (!roll_no) {
          ws.send(
            JSON.stringify({
              type: "roll_invalid",
              message: "Invalid roll number",
            })
          );
          return;
        }

        // set token in redis and expire after 30 seconds
        await redisClient.set(token, roll_no, "EX", 30);

        ws.send(
          JSON.stringify({
            type: "token_stored",
            data: {
              roll_no,
              token,
            },
          })
        );
      } catch (err) {
        console.error("Token store error:", err);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Internal error while storing token",
          })
        );
      }
}

const attachWebSocket = (userConnections) => {
  return (req, res, next) => {
    req.userConnections = userConnections;
    next();
  };
};
app.use(attachWebSocket(userConnections));

app.use(process.env.BASE_ROUTE, entryRoute);
// app.use(process.env.BASE_ROUTE, authRoute);
app.use(process.env.BASE_ROUTE, getSlotRoutes);

app.get("/library/ws-status", (req, res) => {
  res.json({
    status: "active",
    connectedUsers: req.userConnections.size,
    timestamp: Date.now(),
  });
});
app.use(errorHandler);

process.on("SIGINT", async () => {
  wss.close(() => {
    console.log("All WebSocket connections closed");
    disconnectDatabase();
  });
});


server.listen(process.env.PORT, ()=>{
    console.log(`server listening on port ${process.env.PORT}`)
});
