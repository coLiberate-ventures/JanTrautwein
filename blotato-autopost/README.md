# blotato-autopost

Automated social-media publishing through the [Blotato](https://www.blotato.com) API,
driven entirely from this repository. You add posts to a JSON queue; a GitHub Actions
workflow submits them to Blotato, which publishes (or schedules) them to your connected
social accounts.

> ⚠️ **Keep this repository private.** Your Blotato API key is stored as a GitHub
> Actions **secret**, never in the code. Do not paste the key into any file here.

---

## How it works

```
content/queue.json  ──►  scripts/publish.mjs  ──►  Blotato API (POST /v2/posts)  ──►  your socials
        ▲                        │
   you add posts          GitHub Actions runs it on push / schedule
                                 │
                                 ▼
                    content/published/<date>.json   (archive of what was sent)
```

- **`content/queue.json`** — posts waiting to be submitted. Edit this file to schedule content.
- **`scripts/publish.mjs`** — zero-dependency Node script (uses the built-in `fetch`). Submits each queued post to Blotato, archives successes, keeps failures in the queue for the next run.
- **`accounts.json`** — maps each platform to its Blotato `accountId` (and any platform-specific target fields). Account IDs are *not* secrets, so this is committed.
- **`.github/workflows/publish.yml`** — runs the script on every push that changes the queue, on a manual trigger, and hourly as a safety net.

Scheduling is handled by Blotato itself: a post with a `scheduledTime` is queued by Blotato
for that moment; without one it publishes immediately.

---

## One-time setup

### 1. Create the private repo and push these files

```bash
# from inside the blotato-autopost/ folder
git init
git add .
git commit -m "Initial Blotato auto-publish setup"
gh repo create blotato-autopost --private --source=. --push
# or: git remote add origin <url> && git push -u origin main
```

### 2. Add your Blotato API key as a secret

GitHub → your repo → **Settings → Secrets and variables → Actions → New repository secret**

- **Name:** `BLOTATO_API_KEY`
- **Value:** *(your Blotato API key — find it in Blotato → Settings → API)*

That is the only place the key ever lives. The workflow reads it via `${{ secrets.BLOTATO_API_KEY }}`.

### 3. Fill in your account IDs

Open `accounts.json` and replace each `REPLACE_WITH_..._ACCOUNT_ID` with the Blotato
account ID for that platform. You can find your connected-account IDs in the Blotato
dashboard (Connected Accounts). Delete the platforms you don't use.

| Platform  | Extra `target` fields needed |
|-----------|------------------------------|
| facebook  | `pageId` |
| pinterest | `boardId` |

See the Blotato docs: https://help.blotato.com/api/publish-post

### 4. Test without posting

```bash
npm run dry-run     # prints exact requests, calls nothing
```

For a live local test, copy `.env.example` to `.env`, add your key, then:

```bash
export $(grep -v '^#' .env | xargs) && npm run publish
```

---

## Adding a post

Edit `content/queue.json`:

```json
{
  "posts": [
    {
      "id": "2026-06-20-launch",
      "text": "Big news today here's what we've been building...",
      "mediaUrls": ["https://example.com/image.jpg"],
      "platforms": ["twitter", "linkedin"],
      "scheduledTime": "2026-06-20T09:00:00+00:00"
    }
  ]
}
```

| Field             | Meaning |
|-------------------|---------|
| `id`              | Your label for the post (used in logs/archive). |
| `text`            | The post body. |
| `mediaUrls`       | Optional array of public image/video URLs. |
| `platforms`       | Which platforms to publish to — must match entries in `accounts.json`. |
| `scheduledTime`   | Optional ISO-8601 timestamp with offset. Omit to publish immediately. |
| `useNextFreeSlot` | If `true` and no `scheduledTime`, Blotato picks the next free slot. |
| `targets`         | Per-platform `target` overrides, e.g. `{ "facebook": { "pageId": "..." } }`. |

Commit and push to `main` — the workflow submits the post and archives it automatically.

---

## Notes

- **Rate limit:** Blotato allows ~30 submissions/minute. Normal use stays well under this.
- **Failures:** a failing post stays in `queue.json` with a `lastError` field for the next run.
- **Base URL / auth:** `POST https://backend.blotato.com/v2/posts`, header `blotato-api-key: <KEY>`.
