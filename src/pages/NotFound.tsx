import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="text-center max-w-md">
        {/* Big error code with gradient text */}
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
          404
        </h1>

        <p className="mt-4 text-2xl font-semibold text-gray-800">
          Oops! Page not found.
        </p>
        <p className="mt-2 text-gray-500">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Return Home Button */}
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 transition-all"
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

