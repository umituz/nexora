import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/calculations";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">{user.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge className="mt-1 capitalize">{user.plan}</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Account Details</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <div><p className="text-muted-foreground">User ID</p><p className="font-mono">{user.id}</p></div>
          <div><p className="text-muted-foreground">Joined</p><p>{formatDate(user.createdAt)}</p></div>
          <div><p className="text-muted-foreground">Plan</p><p className="capitalize">{user.plan}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
