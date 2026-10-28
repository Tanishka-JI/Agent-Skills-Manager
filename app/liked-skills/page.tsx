
"use client";

import { useEffect, useState,useRef } from "react";
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
 const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
 const [isSortOpen, setIsSortOpen] = useState(false);
const sortRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


    function saveScrollPosition() {
      sessionStorage.setItem("skills-scroll", String(window.scrollY));
    }


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

//for restoring cuurent positon where user left off when they click on a skill and then return back to the liked skills page
  useEffect(() => {
  if (loading) return;

  const saved = sessionStorage.getItem("skills-scroll");
  if (saved === null) return;

  requestAnimationFrame(() => {
    window.scrollTo(0, Number(saved));
    sessionStorage.removeItem("skills-scroll");
  });
}, [loading, likedSkills]);
      


        useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { 
      if(sortRef.current && !sortRef.current.contains(event.target as Node)){
        setIsSortOpen(false);
      } 
    }

    
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);
       
  


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

   const sortedLikes=[...likedSkills].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });


  return (
     
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">❤️ Liked Skills</h1>
        <p className="text-base-content/70 mt-2">
          All the skills you have liked in one place.
        </p>
      </div>
            
<div className="flex justify-end mb-4">
  {sortedLikes.length > 1 && (
    <div className="relative" ref={sortRef}>
      <button
        type="button"
        onClick={() => setIsSortOpen((prev) => !prev)}
      className="btn btn-sm bg-[#18251c] text-[#a3ffb0] border border-[#39ff88]/40 hover:bg-[#223b2a]"
        aria-expanded={isSortOpen}
        aria-haspopup="true"
      >
        Sort
        <span className="text-xs">▼</span>
      </button>

      {isSortOpen && (
        <div className="absolute right-0 top-full mt-2 z-20 w-40 rounded-lg border border-base-300 bg-base-200 shadow-lg p-1">
          <button
            type="button"
            onClick={() => {
              setSortOrder("newest");
              setIsSortOpen(false);
            }}
            className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-base-300"
          >
            Newest first
          </button>

          <button
            type="button"
            onClick={() => {
              setSortOrder("oldest");
              setIsSortOpen(false);
            }}
            className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-base-300"
          >
            Oldest first
          </button>
        </div>
      )}
    </div>
  )}
</div>


      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : sortedLikes.length === 0 ? (
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
            {sortedLikes.length}{" "}
            {sortedLikes.length === 1 ? "Skill" : "Skills"} liked...
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedLikes.map((item) => (
              <Link
                key={item.id}
                href={`/skills/${item.skill.id}?from=liked-skills`}
               onClick={saveScrollPosition}
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