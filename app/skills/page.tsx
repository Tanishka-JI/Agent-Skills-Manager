import Link from "next/link";
import { prisma } from "../lib/prisma";
import SkillsBrowser from "./SkillsBrowser";

export const revalidate = 60;

export const metadata = {
  title: "Browse Skills | Agent Skills Manager",
  description: "Explore public AI agent skills created by the community",
};

const LIMIT = 10;

async function getSkills(search: string, page: number) {
  const where =
    search === ""
      ? {
          isPublic: true,
        }
      : {
          AND: [
            { isPublic: true },
            {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  content: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            },
          ],
        };

  const totalSkills = await prisma.skill.count({
    where,
  });

  const skills = await prisma.skill.findMany({
    where,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * LIMIT,
    take: LIMIT,
  });

  const totalPages = Math.ceil(totalSkills / LIMIT);

  return {
    skills,
    totalSkills,
    totalPages,
  };
}

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

 const search = (params.search || "").trim();
const page = Math.max(1, Number(params.page) || 1);

  const { skills, totalSkills, totalPages } = await getSkills(
    search,
    page
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-10 border-l-4 border-primary pl-5 flex justify-between items-start gap-4">
        <div>
          <p className="font-mono text-sm text-primary mb-2">
            skills.browse()
          </p>

          <h1 className="text-4xl font-bold">
            Public Skills Gallery
          </h1>

          <p className="text-base-content/70 mt-2 max-w-xl">
            Skills shared by the community. Open one to read it, or create your own.
          </p>

          <p className="font-mono text-sm text-base-content/60 mt-4">
            {totalSkills} public skills
          </p>
        </div>

        <div className="badge badge-outline badge-secondary font-mono">
          ISR: 60s
        </div>
      </div>

      {totalSkills === 0 && search === "" ? (
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
        <SkillsBrowser
          skills={skills}
          search={search}
          page={page}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}