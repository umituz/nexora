import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => ReactNode);
    className?: string;
  }[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({ data, columns, onRowClick, emptyMessage = "No data found" }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col, i) => (
              <th key={i} className={cn("text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn("table-row-hover border-b border-border/50 last:border-0", onRowClick && "cursor-pointer")}
            >
              {columns.map((col, i) => (
                <td key={i} className={cn("py-3 px-4 text-sm", col.className)}>
                  {typeof col.accessor === "function"
                    ? col.accessor(item)
                    : String(item[col.accessor] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
