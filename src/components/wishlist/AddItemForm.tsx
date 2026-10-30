"use client";

import { addCustomItem } from "@/app/account/children/actions";
import { FormMessage, SubmitButton, TextField, useFormAction } from "@/components/auth/FormParts";
import { NOTE_MAX_LENGTH, TITLE_MAX_LENGTH, URL_MAX_LENGTH } from "@/lib/wishlists";

export function AddItemForm({ childId }: { childId: string }) {
  const { state, onSubmit, pending } = useFormAction(addCustomItem.bind(null, childId));

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormMessage error={state.error} />
      <TextField label="What would they like?" name="title" autoComplete="off" maxLength={TITLE_MAX_LENGTH} />
      <TextField
        label="Link to a shop (optional)"
        name="url"
        autoComplete="off"
        required={false}
        maxLength={URL_MAX_LENGTH}
        hint="Paste a link so guests know exactly which one you mean."
      />
      <TextField
        label="Note (optional)"
        name="note"
        autoComplete="off"
        required={false}
        maxLength={NOTE_MAX_LENGTH}
        hint="For example a size, colour or which book in the series."
      />
      <SubmitButton pending={pending}>Add to the list</SubmitButton>
    </form>
  );
}
