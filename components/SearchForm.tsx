"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SearchForm({ initialQuery = "" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("q");

    startTransition(() => {
      router.push(`/?q=${encodeURIComponent(query as string)}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Enter search term..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
