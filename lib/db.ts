import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const DB_PATH = process.env.DB_PATH || resolve(process.env.DB_DIR || "./data", "backup.db");
const MAX_AGE_DAYS = 365;

let dbInstance: DatabaseSync | null = null;

function getDB(): DatabaseSync {
  if (dbInstance) return dbInstance;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS backups (
      code TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_backups_updated ON backups(updated);
  `);
  dbInstance = db;
  return db;
}

export function pruneOld() {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  getDB().prepare("DELETE FROM backups WHERE updated < ?").run(cutoff);
}

export function readBackup(code: string): string | null {
  const row = getDB().prepare("SELECT data FROM backups WHERE code = ?").get(code) as
    | { data: string }
    | undefined;
  return row?.data ?? null;
}

export function writeBackup(code: string, data: string) {
  getDB()
    .prepare("INSERT OR REPLACE INTO backups (code, data, updated) VALUES (?, ?, ?)")
    .run(code, data, Date.now());
  pruneOld();
}

export function deleteBackupRow(code: string): boolean {
  const res = getDB().prepare("DELETE FROM backups WHERE code = ?").run(code);
  return Number(res.changes) > 0;
}

export const CODE_REGEX = /^[A-Z2-9]{3}-[A-Z2-9]{3}$/;
