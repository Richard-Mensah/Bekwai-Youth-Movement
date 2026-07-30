import "server-only"

import { ORG } from "@/constants/nav"

/**
 * The auth emails, composed by us instead of by Supabase.
 *
 * Ported from `supabase/email-templates/*.html`, which were written for the
 * dashboard and are now the source of the design rather than the live copy. The
 * important inheritance is the link shape: `?token_hash=&type=` pointed at
 * `/auth/callback`, never Supabase's `ConfirmationURL`. Those templates carry the
 * reasoning in their header comments and it still holds — `ConfirmationURL` sends
 * the member through a PKCE `?code=` that can only be redeemed in the browser
 * that started the signup, and Gmail opens links in its own in-app browser, so
 * the member arrives confirmed but signed out. A token hash carries its own
 * proof and works from any browser, app or device.
 *
 * Every message has a plain-text part. It is not politeness: a multipart message
 * lands in Gmail's primary tab more reliably than HTML alone, and on a slow
 * connection the text part is what renders.
 */

export type EmailActionType =
  | "signup"
  | "recovery"
  | "magiclink"
  | "invite"
  | "email_change"
  | "reauthentication"

export type AuthEmail = { subject: string; html: string; text: string }

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** The shared shell: eyebrow, heading, body, call to action, fallback URL, footer.
 *  One place so six messages cannot drift apart. */
function shell(opts: {
  heading: string
  intro: string
  actionLabel: string
  actionUrl: string
  expiry: string
  footer: string
}): string {
  const url = escapeHtml(opts.actionUrl)
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1c1c1c">

  <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#14342B">
    ${escapeHtml(ORG.name)}
  </p>
  <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#14342B">
    ${escapeHtml(opts.heading)}
  </h1>

  <p style="margin:0 0 16px;font-size:15px;line-height:1.6">
    ${escapeHtml(opts.intro)}
  </p>

  <p style="margin:0 0 24px">
    <a href="${url}"
       style="display:inline-block;background:#14342B;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:999px">
      ${escapeHtml(opts.actionLabel)}
    </a>
  </p>

  <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#5c5c5c">
    ${escapeHtml(opts.expiry)} If the button does not work, copy this address
    into your browser:
  </p>
  <p style="margin:0 0 24px;font-size:12px;line-height:1.5;word-break:break-all;color:#5c5c5c">
    ${url}
  </p>

  <p style="margin:0;padding-top:20px;border-top:1px solid #e6e6e6;font-size:12px;line-height:1.6;color:#7a7a7a">
    ${escapeHtml(opts.footer)}
  </p>

</div>`
}

function plain(opts: {
  heading: string
  intro: string
  actionUrl: string
  expiry: string
  footer: string
}): string {
  return [
    ORG.name.toUpperCase(),
    "",
    opts.heading,
    "",
    opts.intro,
    "",
    opts.actionUrl,
    "",
    opts.expiry,
    "",
    opts.footer,
  ].join("\n")
}

/**
 * A six-digit code rather than a link — used for `reauthentication`, where the
 * member is already signed in and confirming a sensitive change, so there is a
 * session waiting for the code and nothing to redirect to.
 */
function codeEmail(heading: string, intro: string, token: string, footer: string): AuthEmail {
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1c1c1c">
  <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#14342B">
    ${escapeHtml(ORG.name)}
  </p>
  <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#14342B">${escapeHtml(heading)}</h1>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6">${escapeHtml(intro)}</p>
  <p style="margin:0 0 24px;font-size:32px;font-weight:700;letter-spacing:.18em;color:#14342B">${escapeHtml(token)}</p>
  <p style="margin:0;padding-top:20px;border-top:1px solid #e6e6e6;font-size:12px;line-height:1.6;color:#7a7a7a">
    ${escapeHtml(footer)}
  </p>
</div>`
  return {
    subject: heading,
    html,
    text: [ORG.name.toUpperCase(), "", heading, "", intro, "", token, "", footer].join("\n"),
  }
}

/**
 * Builds the message for one hook invocation.
 *
 * `actionUrl` is assembled by the caller, which is also where `redirect_to` is
 * validated against our own origin — this module must never be the thing that
 * decides where a link points.
 */
export function buildAuthEmail(
  type: EmailActionType,
  actionUrl: string,
  token: string
): AuthEmail {
  switch (type) {
    case "signup": {
      const o = {
        heading: "Confirm your email address",
        intro:
          "Welcome to the movement. Confirm this address to activate your membership account and open your dashboard.",
        actionLabel: "Confirm my email",
        actionUrl,
        expiry: "The link can be used once and expires in 24 hours.",
        footer:
          "An administrator verifies every membership, so your dashboard may show “pending verification” at first — you can still apply for office straight away. If you did not sign up for BYM, ignore this email and no account will be activated.",
      }
      return { subject: "Confirm your email address", html: shell(o), text: plain(o) }
    }

    case "recovery": {
      const o = {
        heading: "Choose a new password",
        intro:
          "Someone asked to reset the password for this address. Use the link below to set a new one.",
        actionLabel: "Set a new password",
        actionUrl,
        expiry: "The link can be used once and expires in one hour.",
        footer:
          "If you did not ask for this, ignore this email — your password stays as it is.",
      }
      return { subject: "Reset your BYM password", html: shell(o), text: plain(o) }
    }

    case "magiclink": {
      const o = {
        heading: "Your sign-in link",
        intro: "Use the link below to sign in to your BYM dashboard. No password needed.",
        actionLabel: "Sign me in",
        actionUrl,
        expiry: "The link can be used once and expires in one hour.",
        footer:
          "If you did not ask to sign in, ignore this email — nobody can use the link but you.",
      }
      return { subject: "Your BYM sign-in link", html: shell(o), text: plain(o) }
    }

    case "invite": {
      const o = {
        heading: "You have been invited to BYM",
        intro: `The Secretariat has invited you to join the ${ORG.name}. Accept below to set a password and open your dashboard.`,
        actionLabel: "Accept the invitation",
        actionUrl,
        expiry: "The invitation can be used once and expires in 24 hours.",
        footer: "If you were not expecting this invitation, you can safely ignore it.",
      }
      return { subject: `You have been invited to ${ORG.shortName}`, html: shell(o), text: plain(o) }
    }

    case "email_change": {
      const o = {
        heading: "Confirm your new email address",
        intro:
          "Confirm this address to finish changing the email you sign in to BYM with.",
        actionLabel: "Confirm this address",
        actionUrl,
        expiry: "The link can be used once and expires in 24 hours.",
        footer:
          "If you did not ask to change your email address, ignore this message and contact the Secretariat — your sign-in address stays as it is.",
      }
      return { subject: "Confirm your new email address", html: shell(o), text: plain(o) }
    }

    case "reauthentication":
      return codeEmail(
        "Confirm it is you",
        "Enter this code to confirm the change you just asked for.",
        token,
        "The code expires shortly. If you did not ask for this, ignore this email."
      )
  }
}
