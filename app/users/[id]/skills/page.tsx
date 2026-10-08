import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserSkillsPage({ params }: PageProps) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    notFound();
  }

  // Check whether user exists
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    notFound();
  }

  // Get only this user's public skills
  const skills = await prisma.skill.findMany({
    where: {
      authorId: userId,
      isPublic: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/skills" className="btn btn-ghost btn-sm">
          ← Back to Skills
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        Public Skills by @{user.name}
      </h1>

      {skills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content/70 mb-4">
            No public skills yet.
          </p>

          <Link href="/skills" className="btn btn-primary">
            Back to Skills
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Link key={skill.id} href={`/skills/${skill.id}`}>
              <div className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow h-full">
                <div className="card-body">
                  <h2 className="card-title">{skill.name}</h2>

                  <p className="text-base-content/70">
                    {skill.description}
                  </p>

                  <div className="text-sm text-base-content/60 mt-auto">
                    Created{" "}
                    {new Date(skill.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}