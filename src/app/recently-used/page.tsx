import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RecentlyUsedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const recentUsages = await prisma.templateUsage.findMany({
    where: {
      userId: Number(session.user.id),
    },
    include: {
      template: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Recently Used Templates</h1>

      {recentUsages.length === 0 ? (
        <p className="text-gray-500">You haven't used any templates yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentUsages.map((usage) => (
            <Link 
              key={usage.id} 
              href={`/templates/${usage.template.id}`}
              className="border p-4 rounded-lg hover:shadow-md transition"
            >
              <h2 className="font-semibold">{usage.template.name}</h2>
              <p className="text-xs text-gray-400">
                Used on: {new Date(usage.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}