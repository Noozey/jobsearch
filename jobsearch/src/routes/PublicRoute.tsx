import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // or from context/state

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default PublicRoute;
