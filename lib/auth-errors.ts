/**
 * Turns a Supabase auth error into something a member can act on.
 *
 * The wording Supabase returns is written for developers — "email rate limit
 * exceeded" tells someone locked out of their account nothing about what to do
 * next, and reads like they did something wrong when the limit is project-wide
 * and shared with every other member. Anything not listed here is passed
 * through unchanged rather than replaced with a vague catch-all.
 */
export function friendlyAuthError(message: string): string {
  if (/rate limit/i.test(message)) {
    return "Too many emails have gone out from the site in the past hour, so this one could not be sent. Please try again in an hour."
  }
  if (/for security purposes|only request this after/i.test(message)) {
    return "That was sent moments ago. Give it a minute, then try again."
  }
  if (/unable to validate email|invalid format/i.test(message)) {
    return "That does not look like a valid email address."
  }
  return message
}
