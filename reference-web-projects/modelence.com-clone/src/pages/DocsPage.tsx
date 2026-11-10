import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mockDocSections } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DocsPage() {
  const { slug } = useParams<{ slug: string }>();
  const categories = [...new Set(mockDocSections.map((s) => s.category))];
  const activeDoc = slug ? mockDocSections.find((s) => s.slug === slug) : mockDocSections[0];

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 shrink-0">
            <h2 className="font-bold text-foreground mb-4">Documentation</h2>
            <nav className="space-y-4">
              {categories.map((cat) => (
                <div key={cat}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{cat}</p>
                  <ul className="space-y-0.5">
                    {mockDocSections.filter((s) => s.category === cat).map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/docs/${s.slug}`}
                          className={cn(
                            "block px-3 py-1.5 text-sm rounded-md transition-colors",
                            activeDoc?.id === s.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          )}
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeDoc ? (
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{activeDoc.title}</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-6">{activeDoc.category}</p>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  <p>{activeDoc.content}</p>
                  <p className="mt-4">
                    This section provides comprehensive documentation on {activeDoc.title.toLowerCase()}.
                    Refer to the API reference for detailed endpoint specifications.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a topic from the sidebar.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
