import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-mint/5">
      <div className="mx-auto w-full max-w-md rounded-xl border bg-card p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-mint">
            <span className="text-lg font-bold text-mint-foreground">C</span>
          </div>
          <h1 className="text-xl font-bold">Sign in to {APP_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">The best QuickBooks Desktop integration on the planet.</p>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="mt-1" />
          </div>
          <Button className="w-full gradient-mint shadow-mint font-semibold" asChild>
            <Link to="/dashboard">Sign in</Link>
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">OR</span></div>
          </div>
          <Button variant="outline" className="w-full">Continue with Google</Button>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/sign-up" className="text-mint font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
