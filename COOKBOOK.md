# Vision Map / Coaching Adventure — Build Cookbook

Everything learned building the interactive "vision map" app, so it can be rebuilt from
scratch with new images, new videos, and more features without relearning the gotchas.

Last updated: 2026-06-25. Working folder: `CLAUDE CO-WORK/PROJECTS/Coaching Adventure/`.

---

## 1. The concept

A full-screen fantasy landscape (traveller on a path looking toward a mountain) with glowing
"light orbs" placed over features of the scene. Hovering an orb labels it; clicking it opens
something:

- **Self** (over the person) → cinematic: character turns around → interactive **Skill Tree** panel.
- **Plan** (over the path) → simple modal (guided questions + textarea).
- **Obstacle** (over the ruins in the path) → simple modal (future: zoom-into-the-barrier scene).
- **Vision** (over the mountain) → cinematic: **fly to the mountain** → "What is the vision?" overlay.

Three page variants exist (each its own folder, each deployed to its own URL):
- `vision-map/` — static image background, plain orbs+modals.
- `vision-map-video/` — looping gentle-sway video background + music.
- `vision-map-flight/` — **the main one.** Static image base + cinematic scenes + skill tree.

---

## 2. Architecture of a page (single self-contained index.html)

- One HTML file, inline `<style>` and `<script>`. Fonts: Lora (serif) + Inter (sans). No build step.
- Brand colors (new palette): `--bg:#DAE7DE; --text:#1A2B28; --muted:#5A7872; --gold:#FAB700;`
  glow rgb `--glow:250,183,0`. No em dashes in copy. Metric units.

### 2a. Orbs anchored to image features (the key trick)
The background must fill the viewport AND the orbs must stay glued to features (person, path,
mountain) at every screen size. Solution: a "cover canvas" sized to the media's aspect ratio,
with orbs positioned in **percent of the media rectangle**.

```css
.canvas{ position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
  width:max(100vw, calc(100vh * W / H));      /* W/H = media aspect, e.g. 1536/1024 */
  height:max(100vh, calc(100vw * H / W)); }
.canvas .bg{ width:100%; height:100%; object-fit:fill; }   /* <img> or <video> */
.orb{ position:absolute; transform:translate(-50%,-50%); } /* left/top set in % */
```
Because the canvas IS the media rectangle (cover behaviour via `max()`), an orb at `left:27.5%;
top:54%` lands on the same pixel of the image regardless of viewport crop.

Orb % positions for the current 1536x1024 image: Self `27.5%,54%`, Obstacle `52%,48%`,
Plan `55%,80%`, Vision `61%,13%`.

### 2b. Mobile
Portrait `@media (max-aspect-ratio: 1/1)`: switch from cover to **contain** so no orb is cropped —
`.canvas{ width:100vw; height:calc(100vw * H / W); }` on a dark gradient bg, with bigger orb tap
targets. Hover labels are hidden on touch; tapping opens the titled scene/modal directly.

### 2c. KEEP ALL MEDIA THE SAME ASPECT RATIO
The single biggest quality win: make the base image and EVERY scene video the same aspect ratio
(we use 3:2). Then crossfades between image and video (and between scenes) are pixel-clean — no
zoom/jump. When an early video came in at 4:3 against a 3:2 image, the transition shifted and
needed a crossfade to hide it. Don't fight that — regenerate so everything is 3:2.

---

## 3. Cinematic scene system (forward + reverse video)

Each "scene" is two video files: a forward clip and its reverse. Clicking an orb plays forward,
holds the last frame, shows an overlay (or not), and a Back arrow plays the reverse to return.

```js
const SCENES = {
  vision: { fwd:'vFwd', rev:'vRev', overlay:'visionOverlay' }, // fly to mountain + text card
  self:   { fwd:'sFwd', rev:'sRev', overlay:'skillOverlay'  }  // turn around + skill tree
};
```
Markup: a fixed `#sceneStage` (z above the map) containing one `<video class="scenevid">` per
clip (all `muted playsinline preload="auto"`), a `.flyback` Back button, and the overlay(s).
`.scenevid{display:none} .scenevid.active{display:block}` — only one visible at a time.

### 3a. GOTCHA: holding the last frame — DO NOT seek
On some servers (incl. the local python preview) videos report `seekable=[0,0]`. Setting
`video.currentTime = duration` then **clamps to 0** and you see frame 0 (character facing away
instead of turned around). Fix: never seek to hold — just let the clip play to its natural end;
it stays painted on the last frame. To **restart** a clip for replay, call `video.load()` (resets
to frame 0 without seeking). This is server-agnostic (works locally and on GitHub Pages).

### 3b. GOTCHA: the "old frame flashes" on Back
A reverse clip left parked at its end shows its last frame (≈ the opening scene). If you reveal it
before it's reset, you get a ~1s flash of the wrong frame. Fix: **reveal a video only once its
first frame is decoded.** Keep the previous (held) frame visible until then:

```js
function playScene(v, reveal){           // reveal = ()=>showVid(targetId)
  var fired=false, onready=function(){ if(fired)return; fired=true; reveal&&reveal(); v.play().catch(function(){}); };
  v.addEventListener('loadeddata', onready, {once:true});
  v.addEventListener('canplay',    onready, {once:true});
  try{ v.pause(); v.load(); }catch(e){ onready(); }
  setTimeout(onready, 1200);             // safety fallback
}
```
Also make `#sceneStage` background **transparent** so any momentary gap reveals the matching
static image underneath instead of a dark/wrong frame.

### 3c. Fades (tuned with the user)
- Scene stage (the video layer) fades **fast: 0.12s** — so the video covers almost instantly and
  you don't see the static image ghosting through during entry.
- Map UI (orbs, title, progress, credit) fades **gentle: 0.9s** in/out.
- IMPORTANT: put the opacity transition on the BASE elements
  (`.orb,.brand,.hint,.progress,.credit{transition:opacity .9s ease}`), NOT only on the
  `.flying` state — otherwise it snaps when `.flying` is removed (nothing left to animate).
- Overlays (vision card slides up, skill panel slides in from right) ~1s.

### 3c-bis. Orbs fade OVER the video; overlays can come in DURING the clip
Two refinements requested after first build:
- **Orbs should fade out on top of the already-playing video** (not be instantly hidden under it).
  The background image and the orbs were in the same `.canvas`; the scene stage (z60) covered both.
  Fix: split into two equally-sized cover layers — `.bg-layer` (the `<img>`+vignette, z1) and
  `.canvas` (orbs only, z5). Then `body.flying .canvas{z-index:70}` lifts the orbs ABOVE the video
  stage so they fade out (0.9s) over the playing clip. Both layers use the IDENTICAL cover-sizing
  rule so orbs stay anchored to image features.
- **Overlay timing per scene.** Add `overlayTiming` to each SCENES entry: `'start'` slides the
  overlay in shortly (~250ms) after the forward clip BEGINS — e.g. the skill tree slides in WHILE
  the character is turning, so they finish together. `'end'` shows it after the clip finishes —
  e.g. the vision card appears on arrival at the mountain. Pre-render interactive overlays
  (`renderSkill()`) at scene start so they're ready to animate in.

### 3d. Encoding scene videos (ffmpeg)
```bash
# forward: drop audio, scale to 1280 wide, web-safe, fast start
ffmpeg -y -i in.mp4 -an -vf "scale=1280:-2" -c:v libx264 -pix_fmt yuv420p -crf 21 -movflags +faststart fwd.mp4
# reverse: same but add ,reverse
ffmpeg -y -i in.mp4 -an -vf "scale=1280:-2,reverse" -c:v libx264 -pix_fmt yuv420p -crf 21 -movflags +faststart rev.mp4
```
Keep scene clips short (2–3s). First frame of forward should ≈ the static base image; last frame is
the destination (mountain / turned-around character). Raw source videos are kept in the working
folder's `video/` but NOT deployed — only the encoded fwd/rev.

---

## 4. Overlays

- **Vision card** (`#visionOverlay`): floats up from the bottom, gradient scrim, eyebrow +
  "What is the vision?" + glassy `<textarea>` + Save. Saves to the shared map store
  (`localStorage` key `visionMap.v1`, field `vision`). Used by the simple modals too.
- **Skill tree** (`#skillOverlay`): slides in from the RIGHT (`transform:translateX(108%)→0`).
  Panel background is translucent (`rgba(14,20,17,.62)` + `backdrop-filter:blur(16px)`) so the
  scene shows through. Built ENTIRELY in HTML/CSS/JS (the video has NO baked-in UI — use the
  "no UI" video variant so the panel is adjustable in code).

### 4a. Interactive skill tree
- 3 tracks (Sales / Public Speaking / Leadership), 5 nodes each, each node 0–3 ranks (the "x/3").
- Data-driven: `TRACKS` array (name + icon key per node) and an `ICONS` map of inline SVGs.
- **Fills strictly bottom-up, no gaps:** the lowest not-full node is the "frontier"; only it is
  clickable. Clicking spends 1 point and adds a rank; a node must hit 3/3 before the next unlocks.
- `START_POINTS=12` (one constant to change). Counter shows "N skill points available".
- Right-click a track to refund the last point; a Reset button refunds everything.
- Persists to `localStorage` key `skillTree.v1` (`{sales:[..],speaking:[..],leadership:[..],points}`).
- Node names are easy-to-edit drafts. Rendered with `flex-direction` so node[0] is at the BOTTOM,
  connectors (up-arrows) between, lit when the lower node is full.

---

## 5. Music

- **Sourcing:** Pixabay has great loops but Cloudflare blocks automated download (403). Kevin
  MacLeod / incompetech.com allows direct download and is CC-BY (attribution REQUIRED):
  `https://incompetech.com/music/royalty-free/mp3-royaltyfree/<Track%20Name>.mp3`
  (URL-encode spaces as %20; some titles 404 — probe first).
- Picks: "Heroic Age" (too heroic per feedback) → replaced with **"Beauty Flow"** (calm, gentle
  piano, 7min so loop seam is rare). Other calm options downloaded: Wholesome, Tranquility,
  Lightless Dawn, Hidden Past, Long Note Two, Heartwarming.
- Encode: `ffmpeg -i in.mp3 -af "afade=t=in:st=0:d=1.2,volume=0.9" -b:a 128k -ac 2 ambient-loop.mp3`
- Attribution line is shown bottom-right and is mandatory for CC-BY.
- **Autoplay is blocked by browsers** — audio cannot start until a user gesture. So there is a
  "♪ Sound" toggle button; music starts (volume fades 0→0.55) on first click.

### 5a. GOTCHA that bit us: scope + lazy lookup
Two failure modes to avoid:
1. The whole sound block was once accidentally inserted INSIDE another function (`save()`), so
   `setSound`/`bgm` were local and the click listener never attached → button styled but silent.
   Keep sound code at the TOP LEVEL of the script.
2. The `<audio>` element sits after the script in the DOM, so `document.getElementById('bgm')` at
   script-parse time returns null. Look up `bgm` LAZILY inside `setSound`/`fadeTo` (at click time),
   not once at the top.

---

## 6. Build/templating method

Pages are generated by Python string-surgery on a base page (e.g. start from `vision-map-video`
and swap the background `<video>`→`<img>`, change the aspect ratio numbers, inject scene
CSS/HTML/JS). Lessons:
- Insert scene MARKUP **before** the main `<script>` (so `getElementById` finds it at run time).
- DANGER: appending JS "after the last `refreshOrbState();`" can land inside the WRONG function if
  that token appears in multiple places (it bit us — the sound block ended up inside `save()`).
  Prefer anchoring inserts to a unique marker, or insert right before `</script>`. After any
  string-surgery, sanity-check: `typeof eachFunction` is `"function"`, and load the page to check
  the console.
- Every page needs the PostHog snippet before `</head>` (analytics is site-wide).

---

## 7. Local preview (iCloud + sandbox gotchas)

- The Claude preview server CANNOT serve files from the iCloud path (`~/Library/Mobile
  Documents/...`) — the spawned process hits a TCC sandbox `getcwd: Operation not permitted`.
- Workaround: copy the folder to `/tmp/<name>` and serve from there with system python via a bash
  wrapper that cd's into an accessible dir first:
  `.claude/launch.json` → `{"runtimeExecutable":"/bin/bash","runtimeArgs":["-c","cd /tmp && exec
  /usr/bin/python3 -m http.server 8131 --directory /tmp/vision-map"],"port":8131}`
- Re-copy the edited file into `/tmp/...` after each change. The Bash tool itself only reads the
  iCloud path with `dangerouslyDisableSandbox: true`.
- Python http.server reports `seekable=[0,0]` (see 3a) — verify video behaviour with the
  load()-based approach, not seeking.
- `preview_screenshot` cannot composite a playing `<video>` reliably (shows partial/poster); trust
  DOM/eval state (currentTime, readyState) and screenshot only PAUSED/held frames.

---

## 8. Deploy

- Source of truth (working folder): `CLAUDE CO-WORK/PROJECTS/Coaching Adventure/`.
- Deploy repo is SEPARATE: `Claude Website 2026/DEPLOY/` → GitHub `coLiberate-ventures/JanTrautwein`
  → GitHub Pages → jantrautwein.com. Each app is a subfolder there (`/vision-map-flight/` etc.).
- Flow: copy app folder into DEPLOY, ensure PostHog snippet present, `git add` only that folder,
  commit (co-author line), push to `main`. Push prints "Bypassed rule violations" — that's normal,
  it succeeds. If the remote moved: stash untracked, `git fetch && git rebase origin/main`, pop.
- GitHub Pages takes ~1–2 min; the CDN can serve a STALE file (esp. swapped audio) for ~90s even
  with a cache-buster — poll the byte size until it matches before trusting a test.
- A user `/deploy` skill exists that automates the DEPLOY-repo commit/push + PostHog check.

---

## 9. Future ideas (not yet built)
- Obstacle orb → zoom into the ruins/barrier (same scene pattern; needs fwd+rev video).
- Plan orb → its own cinematic.
- Skill tree: real skill names/icons per track; earned-points logic tied to coaching milestones.
- Possibly regenerate the base as a 3:2 looping video that exactly matches the fly-in first frame
  for a living background that's still seamless.
