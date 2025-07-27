import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ roles }) {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const role = JSON.parse(localStorage.getItem("userDetails"))?.existingUser
    ?.role;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
