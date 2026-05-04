import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; 

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
      await tx.templateUsage.upsert({
        where: {
          userId_templateId: {
            userId: userId,
            templateId: tId,
          },
        },
        update: {
          updatedAt: new Date(),
        },
        create: {
          userId: userId,
          templateId: tId,
        },
      });

      
      return await tx.template.update({
        where: { id: tId },
        data: { used: { increment: 1 } },
      });
    });

    return NextResponse.json({ success: true, used: result.used });

  } catch (error: unknown) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}