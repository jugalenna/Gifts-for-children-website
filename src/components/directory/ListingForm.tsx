"use client";

import { useId } from "react";
import { FormMessage, SubmitButton, TextField, inputClass, useFormAction } from "@/components/auth/FormParts";
import type { FormState } from "@/lib/auth";
import {
  CITY_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  LISTING_KINDS,
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  WEBSITE_MAX_LENGTH,
  type Listing,
} from "@/lib/directory";

type ListingFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  // Country names come from the server, so they match on every device.
  countries: { code: string; name: string }[];
  listing?: Listing;
  submitLabel: string;
};

export function ListingForm({ action, countries, listing, submitLabel }: ListingFormProps) {
  const { state, onSubmit, pending } = useFormAction(action);
  const id = useId();

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormMessage error={state.error} />
      <TextField
        label="Business name"
        name="name"
        autoComplete="organization"
        maxLength={NAME_MAX_LENGTH}
        defaultValue={listing?.name}
      />
      <div>
        <label htmlFor={`${id}-kind`} className="mb-1 block font-semibold">
          Type of business
        </label>
        <select id={`${id}-kind`} name="kind" required defaultValue={listing?.kind ?? ""} className={inputClass}>
          <option value="" disabled>
            Choose a type
          </option>
          {LISTING_KINDS.map((kind) => (
            <option key={kind.slug} value={kind.slug}>
              {kind.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-description`} className="mb-1 block font-semibold">
          Short description
        </label>
        <textarea
          id={`${id}-description`}
          name="description"
          required
          rows={4}
          maxLength={DESCRIPTION_MAX_LENGTH}
          defaultValue={listing?.description}
          aria-describedby={`${id}-description-hint`}
          className={inputClass}
        />
        <p id={`${id}-description-hint`} className="mt-1 text-sm">
          What you sell or offer for children, in a sentence or two (up to {DESCRIPTION_MAX_LENGTH} characters).
        </p>
      </div>
      <div>
        <label htmlFor={`${id}-country`} className="mb-1 block font-semibold">
          Country
        </label>
        <select
          id={`${id}-country`}
          name="country"
          required
          autoComplete="country"
          defaultValue={listing?.country ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Choose a country
          </option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <TextField
        label="City or town"
        name="city"
        autoComplete="address-level2"
        maxLength={CITY_MAX_LENGTH}
        defaultValue={listing?.city}
        hint="If you only sell online, enter the city you work from."
      />

      <fieldset className="space-y-5 rounded-2xl border-2 border-cloud p-4">
        <legend className="px-1 font-bold">How can customers reach you?</legend>
        <p className="text-sm">Add at least one. These are shown publicly in the directory.</p>
        <TextField
          label="Website (optional)"
          name="website"
          autoComplete="url"
          required={false}
          maxLength={WEBSITE_MAX_LENGTH}
          defaultValue={listing?.website ?? ""}
        />
        <TextField
          label="Email (optional)"
          name="email"
          type="email"
          autoComplete="email"
          required={false}
          maxLength={EMAIL_MAX_LENGTH}
          defaultValue={listing?.email ?? ""}
        />
        <TextField
          label="Phone (optional)"
          name="phone"
          autoComplete="tel"
          required={false}
          maxLength={PHONE_MAX_LENGTH + 1}
          defaultValue={listing?.phone ?? ""}
          hint="Include the country code, for example +27 21 123 4567."
        />
      </fieldset>

      <div className="flex gap-3">
        <input id={`${id}-confirm`} name="confirm" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-peach-dark" />
        <label htmlFor={`${id}-confirm`}>
          This business sells products or services suitable for children, the details are correct, and I&apos;m
          allowed to list it.
        </label>
      </div>
      <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
    </form>
  );
}
