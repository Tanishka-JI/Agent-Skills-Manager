
"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../lib/auth";

interface SkillFormData {
  name: string;
  description: string;
  content: string;
  isPublic: boolean;
}

interface ActionResult {
  success: boolean;
  error?: string;
  skillId?: number;
}

export async function createSkill(
  data: SkillFormData
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        isPublic: data.isPublic,
        authorId: currentUser.userId,
      },
    });

    revalidatePath("/skills");
    revalidatePath("/dashboard");

    return { success: true, skillId: skill.id };
  } catch (error) {
    console.error("Create skill error:", error);
    return { success: false, error: "Failed to create skill" };
  }
}

export async function updateSkill(
  id: number,
  data: SkillFormData
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await prisma.skill.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existing || existing.authorId !== currentUser.userId) {
      return {
        success: false,
        error: "Not authorized to edit this skill",
      };
    }

    await prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/skills");
    revalidatePath(`/skills/${id}`);
    revalidatePath("/dashboard");

    return { success: true, skillId: id };
  } catch (error) {
    console.error("Update skill error:", error);
    return { success: false, error: "Failed to update skill" };
  }
}

export async function deleteSkill(
  id: number
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await prisma.skill.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existing || existing.authorId !== currentUser.userId) {
      return {
        success: false,
        error: "Not authorized to delete this skill",
      };
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: { skillId: id },
      }),
      prisma.skill.delete({
        where: { id },
      }),
    ]);

    revalidatePath("/skills");
    revalidatePath(`/skills/${id}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Delete skill error:", error);
    return { success: false, error: "Failed to delete skill" };
  }
}
