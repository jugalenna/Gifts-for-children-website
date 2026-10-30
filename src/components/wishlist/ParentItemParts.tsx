import { clearReservation, removeCustomItem } from "@/app/account/children/actions";
import type { CustomItem } from "@/lib/wishlists";

const smallButton = "rounded-full border-2 border-peach-dark bg-white px-4 py-2 text-sm font-bold text-peach-dark hover:bg-cloud";

// Shown on an item a guest has said they'll buy. Parents never see who.
export function TakenStatus({ childId, itemKey }: { childId: string; itemKey: string }) {
  return (
    <div className="mb-2 rounded-xl bg-white p-3 text-sm">
      <p className="font-bold">Taken: someone is buying this</p>
      <form action={clearReservation.bind(null, childId, itemKey)} className="mt-2">
        <button type="submit" className={smallButton}>
          Make available again
        </button>
      </form>
    </div>
  );
}

export function CustomItemCard({
  childId,
  item,
  takenStatus,
}: {
  childId: string;
  item: CustomItem;
  takenStatus?: React.ReactNode;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border-2 border-dashed border-peach-light bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide">Your own item</p>
      <h3 className="mt-1 text-lg font-bold leading-snug break-words">{item.title}</h3>
      {item.note && <p className="mt-2 text-sm break-words">{item.note}</p>}
      {item.url && (
        <p className="mt-2 text-sm">
          <a
            href={item.url}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="font-semibold text-peach-dark underline underline-offset-4"
          >
            Open the link
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      )}
      <div className="mt-auto pt-4">
        {takenStatus}
        <form action={removeCustomItem.bind(null, childId, item.id)}>
          <button type="submit" className={smallButton}>
            Remove from list
          </button>
        </form>
      </div>
    </article>
  );
}
