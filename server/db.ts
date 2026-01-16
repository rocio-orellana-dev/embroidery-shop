// server/db.ts
import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error(
      [
        "DATABASE_URL must be set.",
        "Crea un archivo .env en la raíz del proyecto con:",
        "DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/DBNAME",
        "Ejemplo:",
        "DATABASE_URL=postgres://postgres:TU_PASSWORD@localhost:5432/embroidery_shop",
      ].join("\n"),
    );
  }

  // Normaliza el protocolo por compatibilidad (algunas libs esperan postgres://)
  // Node pg soporta ambos, pero lo dejamos consistente.
  if (url.startsWith("postgresql://")) {
    return url.replace("postgresql://", "postgres://");
  }

  return url;
}

export const connectionString = getDatabaseUrl();

// Pool con configuración “limpia” para dev
export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
});

// Si quieres detectar errores de conexión en consola
pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err);
});

export const db = drizzle(pool, { schema });
