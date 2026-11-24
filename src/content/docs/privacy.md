---
title: Privacy
description: What datafromzero collects about visitors, what it does not, and how to change your choices.
tableOfContents: false
---

datafromzero is a static website. It has no accounts, no comments and no saved progress, and it does not
track individual learners. The one form that sends anything is the feedback form at the end of each lesson, described
below.

## Hosting

The site is hosted on GitHub Pages. Like any web host, GitHub receives your IP address and
request details in its server logs when you load a page. We do not have access to those logs
and do not use them. See the
[GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
for how GitHub handles them.

Fonts and scripts are served from this site, so loading a page does not contact other companies.
Links to Google Colab, Google Sheets and GitHub leave this site and follow those services' own
privacy policies.

## The feedback form

Each lesson ends with a "Report an issue" form. (While the form is not switched on, that link opens GitHub's own
issue form instead, and GitHub's privacy statement applies.) When you send the form, we receive three things you give us: the kind of
message you chose, your message, and the lesson page you were on (with the date it was last reviewed). Nothing
else is asked for or kept: no name, no email, no account.

- **It becomes public.** The message is posted as an issue in the
  [project's GitHub repository](https://github.com/datafromzero/datafromzero.github.io/issues?q=label%3Afeedback),
  where anyone can read it, and GitHub's own privacy statement applies to it. Do not write your name, email or
  other personal details in it. We cannot make it private once it is posted.
- **A small service in between.** The form is sent to a Cloudflare Worker that creates the issue for us. Cloudflare
  processes the request and sees your IP address. The service turns the address into a one-way scrambled value
  (a hash) and keeps only that in memory for at most 10 minutes, to stop one sender from flooding the form. The
  address is never logged, stored, or put in the issue, and the stored logs of the service are switched off. See the
  [Cloudflare privacy policy](https://www.cloudflare.com/privacypolicy/).
- **No cookies.** The form sets no cookies and stores nothing in your browser. It works without JavaScript.

## What your browser stores

The site stores only what is needed for your own convenience, in your browser and never sent to us:

- your light or dark theme choice (`starlight-theme`);
- your cookie choice, if analytics is turned on (`dfz-consent`).
