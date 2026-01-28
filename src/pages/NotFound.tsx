import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="glass-intense rounded-2xl p-10 text-center">
        <h1 className="mb-4 text-4xl font-display font-bold text-foreground">404</h1>
        <p className="mb-4 text-lg text-muted-foreground">Oops! Page not found</p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border/50 text-sm font-heading text-primary hover:text-primary-foreground hover:bg-primary transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
