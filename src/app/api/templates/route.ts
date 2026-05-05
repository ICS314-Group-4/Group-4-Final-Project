import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {  
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId } = await req.json();
    const userId = Number(session.user.id);
    const tId = Number(templateId);

    const result = await prisma.$transaction(async (tx) => {
      const existingUsage = await tx.templateUsage.findUnique({
        where: {
          userId_templateId: {
            userId: userId,
            templateId: tId,
          },
        },
      });

      if (existingUsage) {
        await tx.templateUsage.update({
          where: { id: existingUsage.id },
          data: { updatedAt: new Date() },
        });

        return await tx.template.findUnique({ where: { id: tId } });
      } else {
        await tx.templateUsage.create({
          data: {
            userId: userId,
            templateId: tId,
          },
        });

        return await tx.template.update({
          where: { id: tId },
          data: { used: { increment: 1 } },
        });
      }
    });

    return NextResponse.json({ 
      success: true, 
      used: result?.used ?? 0 
    });

  } catch (error: unknown) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}