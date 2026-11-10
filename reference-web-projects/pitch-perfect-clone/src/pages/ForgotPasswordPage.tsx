import { useState } from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="font-heading font-bold text-xl text-foreground">{APP_NAME}</span>
        </Link>
        {sent ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-6">We sent a password reset link to <strong className="text-foreground">{email}</strong></p>
            <Link to="/login" className="text-primary font-medium hover:underline text-sm">Back to login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Forgot password?</h1>
            <p className="text-muted-foreground mb-8">Enter your email and we'll send you a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Email</Label><Input type="email" placeholder="johndoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
            <Link to="/login" className="flex items-center gap-1 mt-6 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
