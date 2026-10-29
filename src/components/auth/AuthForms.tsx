"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, type FormEvent } from "react";
import { changeEmail, deleteAccount, logIn, requestPasswordReset, signUp, updatePassword } from "@/app/auth/actions";
import { authLinkClass as linkClass } from "@/components/auth/AuthLayout";
import { FormMessage, PasswordField, SubmitButton, TextField } from "@/components/auth/FormParts";
import { LOGIN_NOTICES, PASSWORD_MIN_LENGTH, type FormState } from "@/lib/auth";

const initialState: FormState = {};

type ServerAction = (state: FormState, formData: FormData) => Promise<FormState>;

// Submits the form to a server action without React's automatic form reset,
// so what the visitor typed stays in place if there's a mistake to fix.
function useAuthForm(serverAction: ServerAction) {
  const [state, action, pending] = useActionState(serverAction, initialState);
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  }
  return { state, onSubmit, pending };
}
const passwordHint = `At least ${PASSWORD_MIN_LENGTH} characters. A few unrelated words together make a strong, easy-to-remember password.`;

export function SignUpForm() {
  const { state, onSubmit, pending } = useAuthForm(signUp);
  if (state.success) return <FormMessage success={state.success} />;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormMessage error={state.error} />
      <TextField label="Email address" name="email" type="email" autoComplete="email" />
      <PasswordField label="Choose a password" name="password" autoComplete="new-password" hint={passwordHint} />
      <label className="flex items-start gap-3">
        <input type="checkbox" name="adult" required className="mt-1 h-5 w-5 shrink-0 accent-peach-dark" />
        <span>
          I&apos;m 18 or over, and I agree to the{" "}
          <Link href="/terms" target="_blank" className={linkClass}>
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" target="_blank" className={linkClass}>
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <SubmitButton pending={pending}>Create my account</SubmitButton>
    </form>
  );
}

export function LoginForm() {
  const { state, onSubmit, pending } = useAuthForm(logIn);
  const searchParams = useSearchParams();
  const notice = LOGIN_NOTICES[searchParams.get("notice") ?? ""];

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {notice && !state.error && <FormMessage success={notice} />}
      <FormMessage error={state.error} />
      <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />
      <TextField label="Email address" name="email" type="email" autoComplete="email" />
      <PasswordField label="Password" name="password" autoComplete="current-password" />
      <p className="text-right text-sm">
        <Link href="/forgot-password" className={linkClass}>
          Forgotten your password?
        </Link>
      </p>
      <SubmitButton pending={pending}>Log in</SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const { state, onSubmit, pending } = useAuthForm(requestPasswordReset);
  if (state.success) return <FormMessage success={state.success} />;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormMessage error={state.error} />
      <TextField label="Email address" name="email" type="email" autoComplete="email" />
      <SubmitButton pending={pending}>Send me a link</SubmitButton>
    </form>
  );
}

export function NewPasswordForm() {
  const { state, onSubmit, pending } = useAuthForm(updatePassword);
  if (state.success) {
    return (
      <div className="space-y-4">
        <FormMessage success={state.success} />
        <Link href="/account" className={linkClass}>
          Back to my account
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormMessage error={state.error} />
      <PasswordField label="New password" name="password" autoComplete="new-password" hint={passwordHint} />
      <PasswordField label="Type it again" name="confirm" autoComplete="new-password" />
      <SubmitButton pending={pending}>Save new password</SubmitButton>
    </form>
  );
}

export function ChangeEmailForm() {
  const { state, onSubmit, pending } = useAuthForm(changeEmail);
  if (state.success) {
    return (
      <div className="space-y-4">
        <FormMessage success={state.success} />
        <Link href="/account" className={linkClass}>
          Back to my account
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormMessage error={state.error} />
      <TextField label="New email address" name="email" type="email" autoComplete="email" />
      <SubmitButton pending={pending}>Change my email</SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const { state, onSubmit, pending } = useAuthForm(deleteAccount);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormMessage error={state.error} />
      <PasswordField label="Your password" name="password" autoComplete="current-password" hint="To keep your account safe, please enter your password." />
      <label className="flex items-start gap-3">
        <input type="checkbox" name="understand" required className="mt-1 h-5 w-5 shrink-0 accent-peach-dark" />
        <span>I understand my account and everything saved in it will be deleted for good.</span>
      </label>
      <SubmitButton pending={pending}>Delete my account</SubmitButton>
    </form>
  );
}
