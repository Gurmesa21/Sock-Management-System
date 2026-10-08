import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../context/useAuth";

function PermissionRoute({
  permission,
}) {
  const { hasPermission } =
    useAuth();

  if (!hasPermission(permission)) {
    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return <Outlet />;
}

export default PermissionRoute;