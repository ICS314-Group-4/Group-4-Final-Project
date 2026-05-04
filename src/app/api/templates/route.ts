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
      // 1. Update or Create the usage record
      await tx.templateUsage.upsert({
        where: {
          userId_templateId: {
            userId: userId,
            templateId: tId,
          },
        },
        update: {
          updatedAt: new Date(), // This moves it to the top of the "Recent" list
        },
        create: {
          userId: userId,
          templateId: tId,
        },
      });

      // 2. Increment total usage count on the template itself
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