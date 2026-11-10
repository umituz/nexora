import { mockDeployments } from "@/lib/mock-data";
import { formatDate, getStatusBadgeVariant } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Play, Square, RotateCcw } from "lucide-react";

export default function DeploymentsPage() {
  const handleAction = (action: string, name: string) => {
    toast.success(`${action} "${name}" — this is a mock action`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bot</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Deployed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDeployments.map((dep) => (
                <TableRow key={dep.id}>
                  <TableCell className="font-medium">{dep.botName}</TableCell>
                  <TableCell className="capitalize">{dep.platform}</TableCell>
                  <TableCell className="font-mono text-xs">{dep.region}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(dep.status)}>{dep.status}</Badge>
                  </TableCell>
                  <TableCell>{dep.uptime}%</TableCell>
                  <TableCell>{formatDate(dep.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {dep.status === "running" ? (
                        <Button size="icon" variant="ghost" onClick={() => handleAction("Stopped", dep.botName)}>
                          <Square className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button size="icon" variant="ghost" onClick={() => handleAction("Started", dep.botName)}>
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => handleAction("Restarted", dep.botName)}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
