import Form from "next/form";

export function SearchBox() {
  return (
    <Form action="/search" role="search" className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <label htmlFor="gift-search" className="sr-only">
        Search gift ideas
      </label>
      <input
        id="gift-search"
        name="q"
        type="search"
        placeholder="Try “books for a 5 year old”"
        className="w-full flex-1 rounded-full border-2 border-white bg-white px-5 py-3 text-base shadow-sm placeholder:text-ink/80 focus:border-peach-dark focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-peach-dark px-6 py-3 font-bold text-white shadow-sm hover:bg-ink"
      >
        Search
      </button>
    </Form>
  );
}
