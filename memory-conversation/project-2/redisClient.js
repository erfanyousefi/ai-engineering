import {createClient} from "redis";

export const redis = createClient({
  url: "redis://localhost:6379",
});

redis.on("error", (err) => {
  console.log(err);
});
await redis.connect();
console.log("connected to redis successfully");
