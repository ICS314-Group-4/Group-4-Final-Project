import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// This is your custom POST handler for the counter
export async function POST(req: Request) {
  const session = await auth();

  // 1. Check if user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId } = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      // 2. Try to create the usage record
      // This will fail automatically if the userId/templateId combo exists
      await tx.templateUsage.create({
        data: {
          userId: Number(session.user.id),
          templateId: Number(templateId),
        },
      });

      // 3. Increment the 'used' field in the Template model
      return await tx.template.update({
        where: { id: Number(templateId) },
        data: { used: { increment: 1 } },
      });
    });

    return NextResponse.json({ success: true, used: result.used });
  } catch (error: any) {
    // Prisma error P2002 = Unique constraint failed (User already used this)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: "You have already used this template." },
        { status: 400 }
      );
    }
    
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}