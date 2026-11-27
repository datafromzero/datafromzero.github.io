---
title: Privacy
description: What datafromzero collects about visitors, what it does not, and how to change your choices.
tableOfContents: false
---

datafromzero is a static website. It has no accounts and no comments, and it does not track individual learners.
It can remember your place and the lessons you tick as done, but only inside your own browser (see
[Progress](#progress)). The one form that sends anything is the feedback form at the end of each lesson, described
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

Each lesson ends with a "Report an issue" form, and the "Report a problem" button in the bar at the bottom of every
page opens the same kind of form. When you send it, we receive three things you give us: the kind of message you
chose, your message, and the page you were on (its address and title; on a lesson also its id, and from the
form at the end of a lesson the date it was last reviewed). Nothing else is
asked for or kept: no name, no email, no account.

- **It becomes public.** The message is posted as an issue in the project's GitHub repository,
  where anyone can read it, and GitHub's own privacy statement applies to it. Do not write your name, email or
  other personal details in it. We cannot make it private once it is posted.
- **A small service in between.** The form is sent to a Cloudflare Worker that creates the issue for us. Cloudflare
  processes the request and sees your IP address. The service turns the address into a one-way scrambled value
  (a hash) and keeps only that in memory for at most 10 minutes, to stop one sender from flooding the form. Cloudflare also tells the service which country a request comes from; the service uses it only to decide whether to accept the post and does not keep it. The
  address is never logged, stored, or put in the issue, and the stored logs of the service are switched off. See the
  [Cloudflare privacy policy](https://www.cloudflare.com/privacypolicy/).
- **No cookies.** The form sets no cookies and stores nothing in your browser. It works without JavaScript.

## What your browser stores

The site stores only what is needed for your own convenience, in your browser and never sent to us:

- your light or dark theme choice (`starlight-theme`);
- your cookie choice, if analytics is turned on (`dfz-consent`);
- your place and your done ticks (`dfz-last` and `dfz-done`), described next.

## Progress

When you open a lesson, your browser keeps a short note of it: the lesson's address, its code and title, and the time.
This is what lets the home page and the Start here page show "Continue" with a link to it. On Start here and on the
page of each stage (for example `/sql/`) you can also tick lessons as done. Your ticks are kept as a short list of
lesson ids.

- **It never leaves your device.** The note and the ticks are kept in your browser's local storage under the keys
  `dfz-last` and `dfz-done`. They are not sent to us or to anyone else, they are not part of analytics, and no one can
  see them from another device. There is no account.
- **It is not a cookie.** It is storage you asked for by using the ticks and the Continue link, so it does not need
  the analytics choice above. Analytics works the same whether you use it or not.
- **To clear it,** press **Clear my progress** on Start here or on a stage page (it clears the ticks and the last lesson),
  or clear this site's data in your browser settings. Private windows forget it when you close them.
- **It is optional.** If your browser blocks storage, every page still works; you just do not get Continue or saved ticks.
  If you use two browsers or two phones, each keeps its own.
