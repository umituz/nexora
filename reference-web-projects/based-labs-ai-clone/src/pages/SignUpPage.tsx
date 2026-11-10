import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <h1 className="font-display text-2xl font-bold text-center">Create Account</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Username</label>
            <input type="text" placeholder="creative_artist" className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input type="email" placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <input type="password" placeholder="••••••••" className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          </div>
          <Link to="/dashboard/generate"><Button className="w-full bg-gradient-primary text-primary-foreground">Create Account</Button></Link>
          <Button variant="outline" className="w-full">Continue with Google</Button>
          <p className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/sign-in" className="text-primary hover:underline">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
