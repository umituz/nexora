import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DataTableShellProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  actions?: ReactNode;
  children: ReactNode;
}

export function DataTableShell({
  title,
  description,
  searchPlaceholder = "Search...",
  onSearch,
  actions,
  children,
}: DataTableShellProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch?.(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
          )}
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
}
