import { useState } from "react";
import { mockApiKeys, type ApiKey } from "@/lib/mock-data";
import { formatDate, timeAgo, generateId } from "@/lib/calculations";
import { getFromStorage, setToStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(() =>
    getFromStorage<ApiKey[]>(STORAGE_KEYS.API_KEYS, mockApiKeys)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const saveKeys = (updated: ApiKey[]) => {
    setKeys(updated);
    setToStorage(STORAGE_KEYS.API_KEYS, updated);
  };

  const handleCreate = () => {
    if (!newName) { toast.error("Please enter a name"); return; }
    const key: ApiKey = {
      id: generateId(),
      name: newName,
      key: `cd_${Math.random().toString(36).slice(2, 14)}`,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      permissions: ["read", "write"],
    };
    saveKeys([key, ...keys]);
    setNewName("");
    setDialogOpen(false);
    toast.success("API key created");
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create API Key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create API Key</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="My API Key" />
              </div>
              <Button onClick={handleCreate} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {visibleKeys.has(k.id) ? k.key : `${k.key.slice(0, 8)}${"•".repeat(12)}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {k.permissions.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(k.createdAt)}</TableCell>
                  <TableCell>{timeAgo(k.lastUsed)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toggleVisibility(k.id)}>
                        {visibleKeys.has(k.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => copyKey(k.key)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { saveKeys(keys.filter((x) => x.id !== k.id)); toast.success("Deleted"); }}>
                        <Trash2 className="h-3 w-3 text-destructive" />
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
