export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72; // Supabase ignores anything longer

export type FormState = { error?: string; success?: string };

// Only allow redirects to pages on our own site, e.g. "/account".
export function safeNextPath(next: string | null | undefined, fallback = "/account"): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}

export function passwordProblem(password: string): string | undefined {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Please use a password of at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Please use a password of no more than ${PASSWORD_MAX_LENGTH} characters.`;
  }
}

// Turn Supabase error codes into friendly words. Unknown errors get a
// general message rather than technical detail.
export function friendlyAuthError(code: string | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return "That email and password don't match. Please try again.";
    case "email_not_confirmed":
      return "Please confirm your email address first. Check your inbox for the link we sent you.";
    case "weak_password":
      return "Please choose a stronger password, for example a few unrelated words together.";
    case "same_password":
      return "Your new password must be different from your old one.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a few minutes and try again.";
    default:
      return "Something went wrong. Please try again in a moment.";
  }
}

// Messages shown on the login page after following an email link.
export const LOGIN_NOTICES: Record<string, string> = {
  "link-invalid": "That link has expired or was already used. Please log in, or ask for a new link.",
  "logged-out": "You've been logged out.",
};

// Messages shown on the account page.
export const ACCOUNT_NOTICES: Record<string, string> = {
  "email-changed": "Your email address has been changed.",
  "child-removed": "The child and their gift list have been removed.",
};
