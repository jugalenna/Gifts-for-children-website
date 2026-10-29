"use client";

import { startTransition, useActionState, useId, useState, type FormEvent, type ReactNode } from "react";
import type { FormState } from "@/lib/auth";

type ServerAction = (state: FormState, formData: FormData) => Promise<FormState>;

// Submits the form to a server action without React's automatic form reset,
// so what the visitor typed stays in place if there's a mistake to fix.
export function useFormAction(serverAction: ServerAction) {
  const [state, action, pending] = useActionState(serverAction, {});
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  }
  return { state, onSubmit, pending };
}

export const inputClass =
  "w-full rounded-xl border-2 border-cloud bg-white px-4 py-3 text-base focus:border-peach-dark focus:outline-none";

type FieldProps = {
  label: string;
  name: string;
  type?: "email" | "text";
  autoComplete: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
};

export function TextField({ label, name, type = "text", autoComplete, hint, required = true, maxLength, defaultValue }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={inputClass}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm">
          {hint}
        </p>
      )}
    </div>
  );
}

export function PasswordField({ label, name, autoComplete, hint }: Pick<FieldProps, "label" | "name" | "autoComplete" | "hint">) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${inputClass} pr-20`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-controls={id}
          aria-pressed={visible}
          className="absolute inset-y-0 right-2 my-2 rounded-lg px-3 text-sm font-semibold hover:bg-cloud"
        >
          {visible ? "Hide" : "Show"}
          <span className="sr-only"> password</span>
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (error) {
    return (
      <p role="alert" className="rounded-xl border-2 border-peach-dark bg-white p-3 font-semibold">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p role="status" className="rounded-xl bg-peach-light p-3 font-semibold">
        {success}
      </p>
    );
  }
  return null;
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-peach-dark px-6 py-3 font-bold text-white hover:bg-ink disabled:opacity-70"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}
