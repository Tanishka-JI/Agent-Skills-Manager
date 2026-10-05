"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SkillsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search")?.toString() || "";

    const params = new URLSearchParams();

    if (searchValue) {
      params.set("search", searchValue);
    }

    params.set("page", "1");

    router.push(`/skills?${params.toString()}`);
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          name="search"
          type="text"
          placeholder="Search skills..."
          defaultValue={search}
        />

        <button type="submit">
          Search
        </button>
      </form>
    </div>
  );
}