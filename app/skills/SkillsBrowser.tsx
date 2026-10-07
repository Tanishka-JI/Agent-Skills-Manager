"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Prisma } from "@prisma/client";

type SkillWithAuthor = Prisma.SkillGetPayload<{
  include: {
    author: {
      select: {
        name: true;
      };
    };
  };
}>;

interface SkillsBrowserProps {
  skills: SkillWithAuthor[];
  search: string;
  page: number;
  totalPages: number;
}

export default function SkillsBrowser({
  skills,
  search,
  page,
  totalPages,
}: SkillsBrowserProps) {
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search")?.toString() || "";

    const params = new URLSearchParams();

    if (searchValue) {
      params.set("search", searchValue);
    }

    // New search always starts from page 1
    params.set("page", "1");

    router.push(`/skills?${params.toString()}`);
  }

  function handlePageChange(pageNumber: number) {
    const params = new URLSearchParams();

    // Preserve current search
    if (search) {
      params.set("search", search);
    }

    params.set("page", pageNumber.toString());

    router.push(`/skills?${params.toString()}`);
  }

  return (
    <div>
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          name="search"
          type="text"
          placeholder="Search skills..."
          defaultValue={search}
          className="input input-bordered flex-1"
        />

        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Skills */}
      {skills.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-base-300 rounded-box">
          <p className="font-mono text-primary text-lg mb-2">
            {"// no skills found"}
          </p>

          <p className="text-base-content/70 mb-5">
            Try searching for something else.
          </p>

          <Link href="/skills" className="btn btn-outline">
            Back to Public Skills
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Link
                key={skill.id}
                href={`/skills/${skill.id}`}
                className="card bg-base-200"
              >
                <div className="card-body">
                  <h2 className="card-title font-mono">
                    {skill.name}
                  </h2>

                  <p className="text-base-content/70 line-clamp-2 text-sm">
                    {skill.description}
                  </p>

                  <div className="card-actions justify-between items-center mt-4 pt-3 border-t border-base-300">
                    <span className="font-mono text-xs text-primary">
                      @{skill.author.name}
                    </span>

                    <span className="font-mono text-xs text-base-content/50">
                     {new Date(skill.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={
                    page === pageNumber
                      ? "btn btn-primary"
                      : "btn btn-outline"
                  }
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}