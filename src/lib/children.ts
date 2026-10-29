// A child the logged-in adult shops for (see supabase/migrations/001_accounts.sql).
export type Child = {
  id: string;
  nickname: string | null;
  age: number; // the age when it was entered
  age_recorded_on: string; // the date it was entered, e.g. "2026-10-29"
};

export const CHILD_FIELDS = "id, nickname, age, age_recorded_on";
export const NICKNAME_MAX_LENGTH = 30;
export const MAX_CHILDREN = 20;

// The age today: the entered age plus a year for each birthday-free
// anniversary of the date it was entered. We never store a birthday.
export function currentAge(child: Pick<Child, "age" | "age_recorded_on">, today = new Date()): number {
  const [year, month, day] = child.age_recorded_on.split("-").map(Number);
  let years = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) years--;
  return child.age + Math.max(0, years);
}

export function childName(child: Pick<Child, "nickname" | "age" | "age_recorded_on">): string {
  return child.nickname || `Child aged ${currentAge(child)}`;
}

export function ageLabel(age: number): string {
  if (age === 0) return "Under 1";
  return age === 1 ? "1 year old" : `${age} years old`;
}
