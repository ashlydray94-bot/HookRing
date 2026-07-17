import { createServerFn } from "@tanstack/react-start";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const SIGNUPS_FILE = join(DATA_DIR, "signups.json");

interface SignupEntry {
  email: string;
  timestamp: string;
}

async function readSignups(): Promise<SignupEntry[]> {
  try {
    if (!existsSync(SIGNUPS_FILE)) return [];
    const raw = await readFile(SIGNUPS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeSignups(entries: SignupEntry[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(SIGNUPS_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

/** Subscribe an email to the early access list. Deduplicates. */
export const subscribeEmail = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { email: string };
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      throw new Error("Invalid email address");
    }
    return d;
  })
  .handler(async ({ data }) => {
    const entries = await readSignups();
    const exists = entries.some(
      (e) => e.email.toLowerCase() === data.email.toLowerCase(),
    );
    if (!exists) {
      entries.push({
        email: data.email.toLowerCase(),
        timestamp: new Date().toISOString(),
      });
      await writeSignups(entries);
    }
    return { success: true, total: entries.length };
  });

/** Get signup analytics (total count). */
export const getSignupCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const entries = await readSignups();
    return { count: entries.length };
  },
);
