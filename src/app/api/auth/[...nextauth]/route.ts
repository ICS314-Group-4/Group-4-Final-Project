import { handlers } from "@/lib/auth"
export const { GET, POST } = handlers

const trackUsage = async (userId, templateId) => {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Try to create the usage record
      // The @@unique constraint in the schema will throw an error if it already exists
      await tx.templateUsage.create({
        data: {
          userId: userId,
          templateId: templateId,
        },
      });

      // 2. If step 1 succeeded, increment the counter
      await tx.template.update({
        where: { id: templateId },
        data: { usedCount: { increment: 1 } },
      });
    });
    return { success: true };
  } catch (error) {
    // P2002 is the Prisma error code for Unique Constraint violation
    if (error.code === 'P2002') {
      return { success: false, message: "Already incremented" };
    }
    throw error;
  }
};