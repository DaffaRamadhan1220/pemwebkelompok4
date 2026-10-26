import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const admin = localStorage.getItem("gudangku_admin");

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;