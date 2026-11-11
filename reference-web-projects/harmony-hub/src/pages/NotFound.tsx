import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 font-heading text-6xl font-bold text-primary">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Page not found</p>
        <Link to="/" className="rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          Return Home
        </Link>
      </div>
    </div>
  );
}
