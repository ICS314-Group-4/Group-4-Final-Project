import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; // Import the Prisma namespace

export async function POST(req: Request) {  
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId } = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      await tx.templateUsage.create({
        data: {
          userId: Number(session.user.id),
          templateId: Number(templateId),
        },
      });

      return await tx.template.update({
        where: { id: Number(templateId) },
        data: { used: { increment: 1 } },
      });
    });

    return NextResponse.json({ success: true, used: result.used });

  } catch (error: unknown) { // Change 'any' to 'unknown'
    // Check if it's a specific Prisma Error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, message: "Already used" },
          { status: 400 }
        );
      }
    }

    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}