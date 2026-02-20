// api/storage/index.js
// Lista claves con prefijo opcional

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prefix = "" } = req.query;

  // Buscar claves con el prefijo dado
  const keys = await redis.keys(`${prefix}*`);

  return res.status(200).json({ keys, prefix });
}
