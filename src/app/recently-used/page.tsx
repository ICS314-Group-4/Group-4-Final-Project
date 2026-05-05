import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TemplateItem from "@/components/TemplateItem"; 
import { Container } from "react-bootstrap";

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
      template: {
        include: {
          _count: {
            select: { comments: true }
          }
        }
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main>
    {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h1 className="fw-bold mb-1">Recently Used Templates</h1>
              <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                {recentUsages.length} template{recentUsages.length !== 1 ? 's' : ''} available
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

    <div className="container py-4">
      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Template</th>
              <th>Category</th>
              <th>Author</th>
              <th>Used</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {recentUsages.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted">
                  No recently used templates found.
                </td>
              </tr>
            ) : (
              recentUsages.map((usage) => (
                <TemplateItem 
                  key={usage.id} 
                  template={usage.template} 
                  commentCount={usage.template._count?.comments ?? 0}
                  authorName={usage.template.author}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </main>
  );
}