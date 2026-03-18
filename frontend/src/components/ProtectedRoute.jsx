import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  
//   const base_route = "/test/library"

  return token ? <Outlet /> : <Navigate to={`/admin/login`} replace />;
};

export default ProtectedRoute;
