
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

interface LikedSkill {
  id: number;
  skillId: number;
  createdAt: string;
  skill: {
    id: number;
    name: string;
    description: string;
  };
}

export default function LikedSkillsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [likedSkills, setLikedSkills] = useState<LikedSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const fetchLikedSkills = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/likes", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch liked skills.");
        }

        const data = await response.json();
        setLikedSkills(data.likes || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your liked skills. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSkills();
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">❤️ Liked Skills</h1>
        <p className="text-base-content/70 mt-2">
          All the skills you have liked in one place.
        </p>
      </div>

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : likedSkills.length === 0 ? (
        <div className="text-center py-16 border border-base-300 rounded-xl">
          <div className="text-5xl mb-4">🤍</div>

          <h2 className="text-xl font-semibold">
            No liked skills yet!
          </h2>

          <p className="text-base-content/70 mt-2 mb-6">
            Browse skills and like the ones you find useful.
          </p>

          <Link href="/skills" className="btn btn-primary">
            Browse Skills
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-base-content/70 mb-5">
            {likedSkills.length}{" "}
            {likedSkills.length === 1 ? "skill" : "skills"} liked
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {likedSkills.map((item) => (
              <Link
                key={item.id}
                href={`/skills/${item.skill.id}?from=liked-skills`}
                className="card bg-base-200 border border-base-300 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start gap-3">
                    <h2 className="card-title">{item.skill.name}</h2>
                    <span aria-label="Liked" title="Liked">
                      ❤️
                    </span>
                  </div>

                  <p className="text-base-content/70">
                    {item.skill.description}
                  </p>

                  <div className="card-actions justify-end mt-4">
                    <span className="text-primary text-sm">
                      View Skill →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}