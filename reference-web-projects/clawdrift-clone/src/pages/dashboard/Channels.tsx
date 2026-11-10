import { mockChannels } from "@/lib/mock-data";
import { formatNumber, formatDate, getStatusBadgeVariant } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Connected Channels</CardTitle>
          <Button size="sm" onClick={() => toast.info("Channel connection wizard — mock")}>
            Connect Channel
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Bot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Connected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockChannels.map((ch) => (
                <TableRow key={ch.id}>
                  <TableCell className="font-medium">{ch.name}</TableCell>
                  <TableCell className="capitalize">{ch.platform}</TableCell>
                  <TableCell>{ch.botName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(ch.status)}>{ch.status}</Badge>
                  </TableCell>
                  <TableCell>{formatNumber(ch.messagesCount)}</TableCell>
                  <TableCell>{formatDate(ch.connectedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
