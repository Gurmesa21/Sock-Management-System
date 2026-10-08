import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function PublicRoute() {
  const { isAuthenticated } = useAuth();

  /*
  ========================================================
  ALREADY AUTHENTICATED
  ========================================================

  Don't allow an authenticated user to remain
  on the login/authentication pages.
  */

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /*
  ========================================================
  NOT AUTHENTICATED
  ========================================================

  Render the public page.
  */

  return <Outlet />;
}

export default PublicRoute;