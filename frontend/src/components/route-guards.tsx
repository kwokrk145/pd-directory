import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/use-auth";

export const RequireAuth = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#f7f2eb] text-[#10244d]">
        <p className="font-serif text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const RedirectIfAuthenticated = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#f7f2eb] text-[#10244d]">
        <p className="font-serif text-xl">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};
