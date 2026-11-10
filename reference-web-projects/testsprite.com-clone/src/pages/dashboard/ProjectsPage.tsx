import { useState } from "react";
import { MOCK_PROJECTS, type Project } from "@/data/mock";
import { getStatusBg, formatRelativeTime } from "@/utils/calculations";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { generateId } from "@/utils/calculations";

export default function ProjectsPage() {
  const [projects, setProjects] = useLocalStorage<Project[]>("ts_projects", MOCK_PROJECTS);
  const [search, setSearch] = useState("");
  const [newProject, setNewProject] = useState({ name: "", url: "", description: "", framework: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!newProject.name) { toast.error("Project name is required"); return; }
    const proj: Project = {
      id: `proj-${generateId()}`,
      name: newProject.name,
      url: newProject.url || "https://example.com",
      status: "active",
      testCount: 0,
      lastRun: new Date().toISOString(),
      passRate: 0,
      createdAt: new Date().toISOString(),
      description: newProject.description,
      framework: newProject.framework || "React",
      environment: "Development",
    };
    setProjects([proj, ...projects]);
    setNewProject({ name: "", url: "", description: "", framework: "" });
    setDialogOpen(false);
    toast.success("Project created!");
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast.success("Project deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground gap-1"><Plus size={14} /> New Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Create Project</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Project name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
              <Input placeholder="URL" value={newProject.url} onChange={(e) => setNewProject({ ...newProject, url: e.target.value })} />
              <Input placeholder="Framework (e.g., React, Next.js)" value={newProject.framework} onChange={(e) => setNewProject({ ...newProject, framework: e.target.value })} />
              <Input placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
              <Button onClick={handleCreate} className="w-full gradient-primary text-primary-foreground">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proj) => (
          <div key={proj.id} className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-heading font-semibold text-sm">{proj.name}</h3>
                <p className="text-xs text-muted-foreground">{proj.framework} · {proj.environment}</p>
              </div>
              <span className={`status-badge ${getStatusBg(proj.status)}`}>{proj.status}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{proj.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>{proj.testCount} tests</span>
              <span>Pass rate: {proj.passRate}%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last run: {formatRelativeTime(proj.lastRun)}</span>
              <div className="flex gap-2">
                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                  <ExternalLink size={12} />
                </a>
                <button onClick={() => handleDelete(proj.id)} className="text-destructive hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
