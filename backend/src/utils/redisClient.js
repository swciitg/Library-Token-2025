import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // remove this while deploying
});

redisClient.on("connect", () => console.log("-- Connected to Redis"));
redisClient.on("error", (err) => console.error("-- Redis Error", err));

export default redisClient;