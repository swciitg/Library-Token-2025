import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma, {
  connectDatabase,
  disconnectDatabase,
} from "./src/db/config.js";
import entryRoute from "./src/routes/entryRoute.js";
import getSlotRoutes from "./src/routes/getSlotRoutes.js";
import authRoute from "./src/routes/authRoute.js";
import tokenRoute from "./src/routes/tokenRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
import { errorHandler } from "./src/middlewares/error.handler.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import redisClient from "./src/utils/redisClient.js";

dotenv.config();
const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  console.log("UPGRADE REQUEST:", req.url);

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

app.use(cors());
app.use(express.json());

app.get(process.env.BASE_ROUTE, (req, res) => {
  res.send("hi");
});
await connectDatabase();

const userConnections = new Map();

wss.on("connection", async (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const rollno = url.searchParams.get("roll_no");

  if (!rollno) {
    ws.close(1008, "roll number is required");
    return;
  }

  ws.roll_no = rollno;
  console.log(`User connected: ${ws.roll_no}`);

  userConnections.set(rollno.toString(), ws);

  // Send initial entry data
  try {
    const entry = await prisma.entry.findUnique({
      where: { roll_no: BigInt(rollno) },
      include: { slot: true },
    });

    if (!entry) {
      const now = new Date();
      ws.send(
        JSON.stringify({
          type: "slot_info",
          data: {
            slotId: null,
            isEmpty: true,
            time: now.getTime(),
            date: now.toISOString().split("T")[0],
            timeString: now.toTimeString().split(" ")[0],
          },
        }),
      );
    } else {
      ws.send(
        JSON.stringify({
          type: "slot_info",
          data: {
            slotId: entry.slot.id,
            isEmpty: entry.slot.isEmpty,
            time: entry.createdAt.getTime(),
            date: entry.createdAt.toISOString().split("T")[0],
            timeString: entry.createdAt.toTimeString().split(" ")[0],
          },
        }),
      );
    }
  } catch (error) {
    console.error("DB error:", error);
    ws.send(JSON.stringify({ type: "error", message: "Failed to load entry" }));
  }

  ws.on("message", async (message) => {
    console.log("RAW MESSAGE:", message.toString());

    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (err) {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    console.log("PARSED MESSAGE:", payload);

    if (payload.type === "ping") {
      ws.send(
        JSON.stringify({
          type: "pong",
          data: { timestamp: Date.now() },
        }),
      );
    }

    if (payload.type === "generate_token") {
      await handleGenerateToken(ws, payload);
    }

    if (payload.type === "store_token") {
      await handleStoreToken(ws, payload);
    }
  });

  ws.on("close", () => {
    console.log(`User disconnected: ${ws.roll_no}`);
    userConnections.delete(rollno.toString());
  });

  ws.on("error", (err) => {
    console.error(`WS ERROR for ${ws.roll_no}:`, err);
  });
});

const handleGenerateToken = async (ws, payload) => {
  try {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < 8; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    console.log("Generated token: ", token);
    ws.send(
      JSON.stringify({
        "type": "token_generated",
        "data": {token}, 
      })
    )
  } catch (err) {
    console.error("Token generation error:", err);
    ws.send(JSON.stringify({ type: "error", message: "Internal token generation error" }));
  }
}

const handleStoreToken = async (ws, payload) => {
  try {
    const { token, roll_no } = payload.data;

    if (!token) {
      ws.send(JSON.stringify({ type: "error", message: "Token is required" }));
      return;
    }
    if (!roll_no) {
      ws.send(
        JSON.stringify({ type: "roll_invalid", message: "Invalid roll" }),
      );
      return;
    }

    const check = await redisClient.set(token, roll_no, "EX", 30);
    console.log("SET TOKEN:", JSON.stringify(token), token.length);

    ws.send(
      JSON.stringify({
        type: "token_stored",
        data: { roll_no, token },
      }),
    );
  } catch (err) {
    console.error("Token store error:", err);
    ws.send(JSON.stringify({ type: "error", message: "Internal token error" }));
  }
};

const attachWebSocket = (userConnections) => {
  return (req, res, next) => {
    req.userConnections = userConnections;
    next();
  };
};
app.use(attachWebSocket(userConnections));

app.use(process.env.BASE_ROUTE, authRoute);
app.use(process.env.BASE_ROUTE, entryRoute);
app.use(process.env.BASE_ROUTE, getSlotRoutes);
app.use(process.env.BASE_ROUTE, tokenRoute);
app.use(process.env.BASE_ROUTE, adminRoute);

// this is debug route remove it while deploying
app.get(
  process.env.BASE_ROUTE + "/debug/get-token/:token",
  async (req, res) => {
    try {
      const token = req.params.token;
      const value = await redisClient.get(token);

      res.json({
        token,
        value,
        exists: value !== null,
      });
    } catch (err) {
      console.error("Redis read error:", err);
      res.status(500).json({ error: "Redis read failure" });
    }
  },
);

app.get("/library/ws-status", (req, res) => {
  res.json({
    status: "active",
    connectedUsers: req.userConnections.size,
    timestamp: Date.now(),
  });
});
app.use(errorHandler);

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  wss.close();
  await disconnectDatabase();
  process.exit(0);
});

server.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
