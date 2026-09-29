import Link from "next/link";
import { prisma } from "../lib/prisma";

/**
 * Skills Gallery - ISR (Incremental Static Regeneration)
 * Revalidates every 60 seconds for fresh content
 */
export const revalidate = 60;

export const metadata = {
  title: "Browse Skills | Agent Skills Manager",
  description: "Explore public AI agent skills created by the community",
};

async function getPublicSkills() {
  const skills = await prisma.skill.findMany({
    where: { isPublic: true },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return skills;
}

export default async function SkillsPage() {
  const skills = await getPublicSkills();

  return (
  <div className="container mx-auto px-4 py-10">
    {/* Hero */}
    <div className="mb-10 border-l-4 border-primary pl-5 flex justify-between items-start gap-4">
      <div>
        <p className="font-mono text-sm text-primary mb-2">
          skills.browse()
        </p>
        <h1 className="text-4xl font-bold">Public Skills Gallery</h1>
        <p className="text-base-content/70 mt-2 max-w-xl">
          Skills shared by the community. Open one to read it, or create your own.
        </p>
        <p className="font-mono text-sm text-base-content/60 mt-4">
          {skills.length} public skills
        </p>
      </div>
      <div className="badge badge-outline badge-secondary font-mono">
        ISR: 60s
      </div>
    </div>

    {skills.length === 0 ? (
      <div className="text-center py-16 border border-dashed border-base-300 rounded-box">
        <p className="font-mono text-primary text-lg mb-2">
          {"// no skills yet"}
        </p>
        <p className="text-base-content/70 mb-5">
          Be the first to create a skill!
        </p>
        <Link href="/register" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <Link
            key={skill.id}
            href={`/skills/${skill.id}`}
            className="card bg-base-200"
          >
            <div className="card-body">
              <h2 className="card-title font-mono">{skill.name}</h2>
              <p className="text-base-content/70 line-clamp-2 text-sm">
                {skill.description}
              </p>
              <div className="card-actions justify-between items-center mt-4 pt-3 border-t border-base-300">
                <span className="font-mono text-xs text-primary">
                  @{skill.author.name}
                </span>
                <span className="font-mono text-xs text-base-content/50">
                  {new Date(skill.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);
}