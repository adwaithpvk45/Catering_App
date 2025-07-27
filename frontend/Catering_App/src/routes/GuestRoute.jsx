import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const role = JSON.parse(localStorage.getItem("userDetails"))?.existingUser
    ?.role;

  if (isAuthenticated) {
    const redirectPath =
      role === "admin"
        ? "/admin/dashboard"
        : role === "vendor"
        ? "/vendor/vendorDashboard"
        : "/";
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}
