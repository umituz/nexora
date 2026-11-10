import { mockScheduledTasks } from "@/lib/mock-data";
import { formatDateTime, getStatusBadgeVariant } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ScheduledTasksPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Bot</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Next Run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockScheduledTasks.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.action}</p>
                </TableCell>
                <TableCell>{t.botName}</TableCell>
                <TableCell className="font-mono text-xs">{t.schedule}</TableCell>
                <TableCell><Badge variant={getStatusBadgeVariant(t.status)}>{t.status}</Badge></TableCell>
                <TableCell className="text-xs">{formatDateTime(t.lastRun)}</TableCell>
                <TableCell className="text-xs">{formatDateTime(t.nextRun)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
