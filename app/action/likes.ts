
"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../lib/auth";


export async function toggleLike(skillId: number) {
  
  const currentUser = await getCurrentUser();

 if (!currentUser) {
  return {
    success: false,
    message: "Please log in to like this skill.",
  };
}

  // 2. Check whether the skill exists and is public
  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    select: { isPublic: true },
  });

  if (!skill || !skill.isPublic) {
  return {
    success: false,
    message: "Skill not found or not public.",
  };
}
  // 3. Check whether the user already liked this skill
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_skillId: {
        userId: currentUser.userId,
        skillId,
      },
    },
  });

  // 4. Unlike if already liked; otherwise, like
  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_skillId: {
          userId: currentUser.userId,
          skillId,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: currentUser.userId,
        skillId,
      },
    });
  }


  revalidatePath(`/skills/${skillId}`);

  // 6. Get the updated like count
  const likeCount = await prisma.like.count({
    where: { skillId },
  });

  return { success: true, likeCount };
}