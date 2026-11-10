import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          The page <code className="text-sm bg-secondary px-2 py-0.5 rounded">{location.pathname}</code> could not be found.
        </p>
        <Link to="/" className="text-primary hover:underline text-sm">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
