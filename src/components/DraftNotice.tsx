// Shown on legal pages until a qualified person has reviewed them (see CLAUDE.md "Legal to-do").
export function DraftNotice({ written }: { written: string }) {
  return (
    <p role="note" className="mt-6 rounded-2xl border-2 border-dashed border-peach-dark bg-white p-4 text-sm">
      <strong>Draft:</strong> this page was written on {written} and has not
      yet been reviewed by a qualified legal professional. It may change.
    </p>
  );
}
