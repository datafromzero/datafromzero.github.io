/**
 * Redirects for renamed URLs (SPEC §3.3). Published URLs are never removed:
 * when a rename is unavoidable, add `'/old/path/': '/new/path/'` here,
 * keep the lesson `id` unchanged and note the rename in CHANGELOG.md.
 */
export const redirects: Record<string, string> = {};
