// api/storage/[key].js
// API Route de Vercel para manejar el almacenamiento compartido
// Usa Upstash Redis como base de datos

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  // CORS headers para permitir peticiones desde cualquier origen
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Key is required" });
  }

  // GET - Obtener valor
  if (req.method === "GET") {
    const value = await redis.get(key);

    if (value === null) {
      return res.status(404).json({ error: "Key not found" });
    }

    return res.status(200).json({ key, value });
  }

  // POST - Guardar valor
  if (req.method === "POST") {
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: "Value is required" });
    }

    // TTL de 24 horas para que las salas expiren automáticamente
    await redis.set(key, value, { ex: 86400 });

    return res.status(200).json({ key, value });
  }

  // DELETE - Eliminar valor
  if (req.method === "DELETE") {
    await redis.del(key);
    return res.status(200).json({ key, deleted: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
