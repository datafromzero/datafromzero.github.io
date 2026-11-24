# Feedback Worker

A small Cloudflare Worker that receives the lesson footer's feedback form and files it as a public GitHub issue
(SPEC D58). It is one file, `worker.js`, with no build step. It is not part of the website build.

What it does: accepts a form POST only from `https://datafromzero.github.io`; ignores bots that fill the hidden field;
checks the kind and the length of the message (5 to 2000 characters); removes control characters; writes a GitHub
issue titled `[feedback] <kind>: <lesson title>` with the label `feedback`, the message inside a code block (GitHub
does not render Markdown, notify `@` mentions or link `#123` and web addresses inside a code block), the page address
and the date the lesson was reviewed; then sends the reader to `/feedback/sent/` or `/feedback/not-sent/`. It never
writes the sender's IP address or browser into the issue, never logs the message and never logs the address. The
origin check stops other websites' forms and casual misuse; it is not a security boundary, because a script can fake
the header.

## Limits (honest)

- Message: 5 to 2000 characters. The whole request: 16 KB.
- Rate limit: at most 5 messages per 10 minutes for one sender address, counted in the memory of each running Worker
  instance. The address is turned into a salted one-way hash (a random salt for each instance) before it is counted,
  and a hash is forgotten after 10 minutes, so the Worker never holds a raw address. Cloudflare runs several instances in several places and restarts them, so a determined sender can get
  more through. This is a speed bump, not a wall.
- Optional extra: Cloudflare's Rate Limiting binding (3 a minute per address, per Cloudflare location). It needs
  wrangler (see "Deploy with wrangler"); the dashboard path below does not use it.
- Other protection: the origin check, the hidden field and the size limits. If someone still floods the repository,
  revoke the token (step 4 of "Rotate the token"), close or delete the issues and add a stricter rule later.
- Free plan: Cloudflare's free plan allows 100,000 Worker requests a day, far more than this form needs.

## Switch it on (dashboard, no command line)

The Worker `datafromzero-feedback` already exists on the owner's Cloudflare account (it answers "Hello World!" at
`https://datafromzero-feedback.johnha0912.workers.dev`). Starting from that:

1. Create the GitHub token: GitHub, your profile picture, Settings, Developer settings, Personal access tokens,
   Fine-grained tokens, Generate new token. Name it `datafromzero-feedback`. Expiration: one year (put the date in
   your calendar). Repository access: Only select repositories, then `datafromzero/datafromzero.github.io`.
   Repository permissions: **Issues: Read and write** and nothing else (Metadata read-only is added by itself).
   Generate the token and copy it once; GitHub never shows it again.
2. In the repository, create the label `feedback` (Issues, Labels, New label), so the issues carry it.
3. In the Cloudflare dashboard open Workers & Pages, then `datafromzero-feedback`, then Edit code. Delete everything
   in the editor, paste the whole of `workers/feedback/worker.js`, and choose Deploy.
4. Open the Worker's Settings, Variables and Secrets, Add. Type: **Secret**. Name: `GITHUB_TOKEN`. Value: the token
   from step 1. Choose Deploy. (The repository name is built into the code; to use another repository add a
   plain-text variable `GITHUB_REPO` with `owner/name` and deploy again.)
5. Turn the stored logs off. New Workers have Workers Logs on by default, and Cloudflare's invocation logs keep "the
   Request, Response, and related metadata" of every call without saying which request headers (see
   <https://developers.cloudflare.com/workers/observability/logs/workers-logs/>). Open the Worker's Settings,
   Observability (Production) and switch Logs and Traces off. The wrangler path below does the same
   (`[observability] enabled = false` in `wrangler.toml`). Live logs (see "See what happens") store nothing.
6. No binding is needed. The Worker's own in-memory rate limit is on by default. Cloudflare's Rate Limiting binding is
   optional and only set up with wrangler (see below).
7. Open `https://datafromzero-feedback.johnha0912.workers.dev` in a browser: "Method not allowed" is the right answer
   (a browser asks with GET; the Worker takes only POST from the site).
8. Test with curl from a terminal. The first command fakes the site's address and must create an issue and answer
   `303` with `location: https://datafromzero.github.io/feedback/sent/`. The second has no site address and must
   answer `403`:

   ```sh
   curl -i -X POST https://datafromzero-feedback.johnha0912.workers.dev \
     -H 'Origin: https://datafromzero.github.io' \
     --data-urlencode 'category=idea' \
     --data-urlencode 'message=Test message from curl, please ignore.' \
     --data-urlencode 'page=/sql/ctes/' \
     --data-urlencode 'lesson_id=readable-queries-with-ctes' \
     --data-urlencode 'lesson_title=Readable queries with CTEs' \
     --data-urlencode 'reviewed=2026-11-15' \
     --data-urlencode 'website='

   curl -i -X POST https://datafromzero-feedback.johnha0912.workers.dev --data-urlencode 'message=no origin'
   ```

   Close the test issue on GitHub afterwards. `location: .../feedback/not-sent/` instead means the token or its
   permission is wrong (see "See what happens").
9. Only then put the address in `FEEDBACK_URL` in `src/site.ts` (with the `https://`), commit and deploy the site.
   Until then lessons keep the plain GitHub link.
10. Send one real message from a lesson page and check that the issue appears and that you land on the thank-you page.

## Deploy with wrangler (optional)

1. Install Node, then in this folder run `npx wrangler login` and follow the browser window.
2. Run `npx wrangler secret put GITHUB_TOKEN` and paste the token (step 1 of the dashboard steps).
3. Run `npx wrangler deploy`. Wrangler prints the `workers.dev` address.
4. To add Cloudflare's rate limit, uncomment the `[[ratelimits]]` block in `wrangler.toml` and deploy again. If your
   wrangler version rejects the block, leave it commented; the Worker's own limit still applies.

No account id or secret is stored in this folder.

## Rotate the token

1. Create a new token as in step 1 of the dashboard steps.
2. Dashboard: the Worker, Settings, Variables and Secrets, edit `GITHUB_TOKEN`, paste the new value, save and deploy
   (with wrangler: `npx wrangler secret put GITHUB_TOKEN`).
3. Send a test message.
4. Delete the old token on GitHub (Settings, Developer settings, Personal access tokens).
5. If a token ever leaks, do step 4 first, then steps 1 to 3 (the new token is only needed once the old one is gone).

## See what happens (logs)

- Dashboard: the Worker, Observability (or Logs), Live, then send a message. A live view shows what happens now and
  stores nothing. The Worker itself writes only lines such as `GitHub answered 401` (the token is wrong or expired)
  and `GitHub request failed`; no message, no address. With Workers Logs off (step 5) those lines are not kept, so
  look at them live while you test.
- Wrangler: `npx wrangler tail`.
- A reader who sees "Not sent" after a normal message usually means a wrong or expired token (401), a missing
  permission (403 or 404), or the rate limit.

## Test and change it

`tests/feedback-worker.test.ts` runs the validation and the escaping with the rest of `npm run test:unit`. After
changing `worker.js`, run `npm run test:unit`, then paste the file into the dashboard again (step 3 of the dashboard steps).
