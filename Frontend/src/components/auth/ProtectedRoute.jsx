import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();

  const location = useLocation();

  if (authLoading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading authentication...
      </div>
    );
  }

  /*
  ========================================================
  NOT AUTHENTICATED
  ========================================================

  Send the user to login.

  `state.from` remembers the page they originally wanted.
  */

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  /*
  ========================================================
  AUTHENTICATED
  ========================================================

  Render the protected child route.
  */

  return <Outlet />;
}

export default ProtectedRoute;