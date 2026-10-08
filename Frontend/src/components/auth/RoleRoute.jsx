import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../context/useAuth";
function RoleRoute({ allowedRoles }) {
  const { hasRole } = useAuth();

  if (!hasRole(allowedRoles)) {
    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return <Outlet />;
}

export default RoleRoute;