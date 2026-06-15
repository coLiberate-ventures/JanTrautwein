#!/usr/bin/env node
/**
 * Submits queued posts to the Blotato API (POST /v2/posts).
 *
 * Flow:
 *   1. Read content/queue.json
 *   2. For each post, submit it to every target platform
 *   3. Move successfully submitted posts into content/published/<date>.json
 *   4. Leave failed posts in the queue (with a lastError field) for a retry
 *
 * Required env: BLOTATO_API_KEY   (set as a GitHub Actions secret — never commit it)
 * Flags:        --dry-run         (build + log the requests without calling the API)
 *
 * Scheduling is handled by Blotato: if a post has `scheduledTime` (ISO-8601 with
 * offset, e.g. "2026-06-20T09:00:00+00:00") it is queued by Blotato for that time;
 * otherwise it publishes immediately (or at the next free slot if useNextFreeSlot).
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUEUE_PATH = path.join(ROOT, "content", "queue.json");
const ACCOUNTS_PATH = path.join(ROOT, "accounts.json");
const PUBLISHED_DIR = path.join(ROOT, "content", "published");
const API_URL = "https://backend.blotato.com/v2/posts";

const DRY_RUN = process.argv.includes("--dry-run") || process.env.DRY_RUN === "true";
const API_KEY = process.env.BLOTATO_API_KEY;

if (!API_KEY && !DRY_RUN) {
  console.error("✗ BLOTATO_API_KEY is not set. Add it as a repository secret.");
  process.exit(1);
}

const readJson = async (file, fallback) => {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT" && fallback !== undefined) return fallback;
    throw new Error(`Could not read ${file}: ${err.message}`);
  }
};

const buildPayload = (post, platform, accounts) => {
  const account = accounts[platform];
  if (!account || !account.accountId || String(account.accountId).startsWith("REPLACE")) {
    throw new Error(`No accountId configured for "${platform}" in accounts.json`);
  }
  const payload = {
    post: {
      accountId: String(account.accountId),
      content: {
        text: post.text ?? "",
        mediaUrls: post.mediaUrls ?? [],
        platform,
      },
      // targetType + any platform-specific extras (pageId, boardId, ...) from
      // accounts.json, optionally overridden per-post via post.targets[platform].
      target: {
        targetType: platform,
        ...(account.target ?? {}),
        ...(post.targets?.[platform] ?? {}),
      },
    },
  };
  if (post.scheduledTime) payload.scheduledTime = post.scheduledTime;
  else if (post.useNextFreeSlot) payload.useNextFreeSlot = true;
  return payload;
};

const submit = async (payload) => {
  if (DRY_RUN) {
    console.log("  [dry-run] POST", API_URL, JSON.stringify(payload));
    return { dryRun: true };
  }
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "blotato-api-key": API_KEY,
    },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${body}`);
  return body ? JSON.parse(body) : {};
};

const main = async () => {
  const queue = await readJson(QUEUE_PATH, { posts: [] });
  const accounts = await readJson(ACCOUNTS_PATH, {});
  const posts = Array.isArray(queue.posts) ? queue.posts : [];

  if (posts.length === 0) {
    console.log("Queue is empty — nothing to publish.");
    return;
  }

  const remaining = [];
  const published = [];

  for (const post of posts) {
    const platforms = post.platforms ?? [];
    const label = post.id ?? post.text?.slice(0, 40) ?? "(no id)";
    if (platforms.length === 0) {
      console.warn(`! Post "${label}" has no platforms — leaving in queue.`);
      remaining.push(post);
      continue;
    }
    console.log(`\n→ "${label}" → ${platforms.join(", ")}`);
    const results = {};
    let allOk = true;
    for (const platform of platforms) {
      try {
        const result = await submit(buildPayload(post, platform, accounts));
        results[platform] = { ok: true, result };
        console.log(`  ✓ ${platform}`);
      } catch (err) {
        allOk = false;
        results[platform] = { ok: false, error: err.message };
        console.error(`  ✗ ${platform}: ${err.message}`);
      }
    }
    if (allOk) {
      published.push({ ...post, submittedAt: new Date().toISOString(), results });
    } else {
      remaining.push({ ...post, lastError: results });
    }
  }

  if (DRY_RUN) {
    console.log("\nDry run complete — queue not modified.");
    return;
  }

  if (published.length > 0) {
    await mkdir(PUBLISHED_DIR, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 10);
    const archivePath = path.join(PUBLISHED_DIR, `${stamp}.json`);
    const existing = await readJson(archivePath, { posts: [] });
    existing.posts.push(...published);
    await writeFile(archivePath, JSON.stringify(existing, null, 2) + "\n");
  }

  await writeFile(QUEUE_PATH, JSON.stringify({ posts: remaining }, null, 2) + "\n");

  console.log(`\nDone. Submitted: ${published.length}, remaining: ${remaining.length}`);
  if (remaining.some((p) => p.lastError)) {
    console.error("Some posts failed — see content/queue.json (lastError field).");
    process.exit(1);
  }
};

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
