import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", regCode: "", referralCode: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    const success = register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
    if (success) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">{APP_NAME}</span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Get started with {APP_NAME} today</p>
          {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input placeholder="John" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} /></div>
              <div><Label>Last Name</Label><Input placeholder="Doe" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} /></div>
            </div>
            <div><Label>Email</Label><Input type="email" placeholder="johndoe@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Registration Code</Label><Input placeholder="ABC123" value={form.regCode} onChange={(e) => update("regCode", e.target.value)} /></div>
              <div><Label>Referral Code <span className="text-muted-foreground">(Optional)</span></Label><Input value={form.referralCode} onChange={(e) => update("referralCode", e.target.value)} /></div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div><Label>Confirm Password</Label><Input type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} /></div>
            <Button type="submit" className="w-full">Create Account</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <div className="text-primary-foreground max-w-md">
          <h2 className="text-3xl font-heading font-bold mb-4">Build Powerful SMS Workflows in Minutes.</h2>
          <p className="text-primary-foreground/80">Create automated SMS sequences with triggers, conditions, and personalized messages — no coding needed.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Drag-and-Drop Builder", "Smart Triggers", "Personalized Messages"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full border border-primary-foreground/30 text-sm">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
