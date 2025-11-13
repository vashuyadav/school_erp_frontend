import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // agar token nahi hai to login page pe redirect
    return <Navigate to="/login" replace />;
  }

  // agar token hai to component render hone do
  return children;
};

export default ProtectedRoute;
