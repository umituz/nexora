import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Building, MapPin, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { generateId } from "@/lib/calculations";
import { toast } from "sonner";

const searchResults = [
  { name: "Alex Morgan", title: "VP Engineering", company: "TechCorp", location: "San Francisco, CA", industry: "SaaS", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexMorgan" },
  { name: "Rachel Green", title: "Head of Growth", company: "ScaleUp Inc", location: "New York, NY", industry: "FinTech", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RachelGreen" },
  { name: "Mark Stevens", title: "CTO", company: "DataFlow", location: "Austin, TX", industry: "AI/ML", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarkStevens" },
  { name: "Sophie Chen", title: "Product Director", company: "CloudBase", location: "Seattle, WA", industry: "SaaS", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SophieChen" },
  { name: "David Park", title: "CEO", company: "NexGen Labs", location: "Boston, MA", industry: "HealthTech", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DavidPark" },
  { name: "Emma Wilson", title: "Sales Director", company: "ProSales", location: "Chicago, IL", industry: "MarTech", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaWilson" },
];

export default function LeadFinderPage() {
  const { setLeads } = useData();
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("all");
  const [searched, setSearched] = useState(false);

  const filtered = searchResults.filter((r) => {
    const matchesQuery = !query || `${r.name} ${r.company} ${r.title}`.toLowerCase().includes(query.toLowerCase());
    const matchesIndustry = industry === "all" || r.industry === industry;
    return matchesQuery && matchesIndustry;
  });

  const addToLeads = (result: typeof searchResults[0]) => {
    const [firstName, ...rest] = result.name.split(" ");
    setLeads((prev) => [
      {
        id: generateId(), firstName, lastName: rest.join(" "), email: `${firstName.toLowerCase()}@${result.company.toLowerCase().replace(/\s/g, "")}.com`,
        linkedinUrl: `https://linkedin.com/in/${result.name.toLowerCase().replace(/\s/g, "-")}`, company: result.company, title: result.title,
        location: result.location, industry: result.industry, status: "new", tags: [], notes: "", avatar: result.avatar,
        createdAt: new Date().toISOString(), enriched: true,
      },
      ...prev,
    ]);
    toast.success(`${result.name} added to leads`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Lead Finder</h1><p className="text-muted-foreground">Find and import leads</p></div>
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, title, company..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="w-40"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Industry" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="SaaS">SaaS</SelectItem>
            <SelectItem value="FinTech">FinTech</SelectItem>
            <SelectItem value="AI/ML">AI/ML</SelectItem>
            <SelectItem value="HealthTech">HealthTech</SelectItem>
            <SelectItem value="MarTech">MarTech</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setSearched(true)}>Search</Button>
      </div>
      {searched && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r, i) => (
            <Card key={i}><CardContent className="p-4 flex items-center gap-3">
              <img src={r.avatar} alt="" className="h-10 w-10 rounded-full bg-secondary" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Building className="h-3 w-3" />{r.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => addToLeads(r)}><UserPlus className="h-3.5 w-3.5" /></Button>
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
}
