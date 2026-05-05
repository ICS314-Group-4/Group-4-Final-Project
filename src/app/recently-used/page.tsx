import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Container } from "react-bootstrap";
import TemplateFilterUserTemplates from "@/components/TemplateFilterUserTemplates";

export default async function RecentlyUsedPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const recentUsages = await prisma.templateUsage.findMany({
    where: {
      userId: Number(session.user.id),
    },
    include: {
      template: {
        include: {
          _count: {
            select: { comments: { where: { isRevision: false } } }
          }
        }
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const templates = recentUsages.map((u) => u.template);
  
  const commentCountMap: Record<number, number> = {};
  templates.forEach(t => {
    commentCountMap[t.id] = t._count?.comments ?? 0;
  });

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <main>
      {/* Header - Consistent with your style */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h1 className="fw-bold mb-1">Recently Used Templates</h1>
              <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.95rem' }}>
                Quickly access the responses you use most often.
              </p>
            </div>
            <a
              href="/add"
              className="btn btn-light fw-semibold"
              style={{ color: '#024731', fontSize: '0.9rem' }}
            >
              + Add Template
            </a>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        <TemplateFilterUserTemplates 
          templates={templates} 
          categories={categories}
          isEditor={false}
          name={session.user.name || "User"}
          commentCount={commentCountMap}
          emptyMessage="You haven't used any templates yet. Browse the library to find one."
        />
      </Container>
    </main>
  );
}