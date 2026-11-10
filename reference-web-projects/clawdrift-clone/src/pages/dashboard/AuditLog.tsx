import { mockAuditLog } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AuditLogPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLog.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-mono text-xs">{entry.action}</TableCell>
                <TableCell>{entry.actor}</TableCell>
                <TableCell>{entry.target}</TableCell>
                <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">{entry.details}</TableCell>
                <TableCell className="text-xs">{formatDateTime(entry.timestamp)}</TableCell>
                <TableCell className="font-mono text-xs">{entry.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
