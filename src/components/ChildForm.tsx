"use client";

import { useId } from "react";
import { FormMessage, SubmitButton, TextField, inputClass, useFormAction } from "@/components/auth/FormParts";
import type { FormState } from "@/lib/auth";
import { ageLabel, NICKNAME_MAX_LENGTH, type Child } from "@/lib/children";

type ChildFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  child?: Pick<Child, "nickname"> & { currentAge: number };
  submitLabel: string;
};

export function ChildForm({ action, child, submitLabel }: ChildFormProps) {
  const { state, onSubmit, pending } = useFormAction(action);
  const ageId = useId();

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormMessage error={state.error} />
      <TextField
        label="Nickname (optional)"
        name="nickname"
        autoComplete="off"
        required={false}
        maxLength={NICKNAME_MAX_LENGTH}
        defaultValue={child?.nickname ?? ""}
        hint="A first name, nickname or initials, just so you can tell your lists apart. Please don't add surnames."
      />
      <div>
        <label htmlFor={ageId} className="mb-1 block font-semibold">
          Age
        </label>
        <select
          id={ageId}
          name="age"
          required
          defaultValue={child ? String(Math.min(child.currentAge, 10)) : ""}
          className={inputClass}
        >
          <option value="" disabled>
            Choose an age
          </option>
          {Array.from({ length: 11 }, (_, age) => (
            <option key={age} value={age}>
              {ageLabel(age)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm">We&apos;ll move the age up automatically each year.</p>
      </div>
      <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
    </form>
  );
}
