
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import CopyMarkdownButton from "./CopyMarkdownButton";
import LikeButton from "./LikeButton";
import { getCurrentUser } from "../../lib/auth";

/**
 * Skill Detail Page - Dynamic Route with ISR
 * Revalidates every 60 seconds
 */
export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  const skill = await prisma.skill.findUnique({
    where: { id: parseInt(id) },
    select: { name: true, description: true },
  });

  if (!skill) {
    return { title: "Skill Not Found" };
  }

  return {
    title: `${skill.name} | Agent Skills Manager`,
    description: skill.description,
  };
}

async function getSkill(id: string) {
  const skillId = parseInt(id);

  if (isNaN(skillId)) return null;

  const currentUser = await getCurrentUser();

  return prisma.skill.findFirst({
    where: {
      id: skillId,
      OR: [
        { isPublic: true },
        ...(currentUser
          ? [{ authorId: currentUser.userId }]
          : []),
      ],
    },
    include: {
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
}

export default async function SkillDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { from } = await searchParams;

  const skill = await getSkill(id);

  if (!skill) {
    notFound();
  }

  const likeCount = await prisma.like.count({
    where: { skillId: skill.id },
  });

  const currentUser = await getCurrentUser();

  const existingLike = currentUser
    ? await prisma.like.findUnique({
        where: {
          userId_skillId: {
            userId: currentUser.userId,
            skillId: skill.id,
          },
        },
      })
    : null;

  const isLiked = !!existingLike;

  const backHref =
    from === "liked-skills" ? "/liked-skills" : "/skills";

  const backText =
    from === "liked-skills"
      ? "← Back to Liked Skills"
      : "← Back to Skills";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href={backHref}
          className="btn btn-ghost btn-sm gap-2"
        >
          {backText}
        </Link>
      </div>

      <article className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{skill.name}</h1>
              <p className="text-base-content/70 mt-2">
                {skill.description}
              </p>
            </div>

            <div className="badge badge-secondary">ISR</div>
          </div>

          <div className="divider"></div>

          <div className="flex gap-4 text-sm text-base-content/60 mb-4">
            <span>
              By{" "}
              <Link
                href={`/users/${skill.author.id}/skills`}
                className="text-primary hover:underline"
              >
                @{skill.author.name}
              </Link>
            </span>

            <span>•</span>

            <span>
              Created{" "}
              {new Date(skill.createdAt).toLocaleDateString("en-IN")}
            </span>

            <span>•</span>

            <span>
              Updated{" "}
              {new Date(skill.updatedAt).toLocaleDateString("en-IN")}
            </span>
          </div>

          <div className="bg-base-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Skill Content</h2>

              <CopyMarkdownButton
                name={skill.name}
                description={skill.description}
                content={skill.content}
              />
            </div>

            <pre className="skill-content whitespace-pre-wrap text-sm">
              {skill.content}
            </pre>
          </div>
        </div>

        {skill.isPublic && (
          <div className="mt-4 flex justify-start">
            <LikeButton
              skillId={skill.id}
              likeCount={likeCount}
              isLiked={isLiked}
            />
          </div>
        )}
      </article>
    </div>
  );
}
