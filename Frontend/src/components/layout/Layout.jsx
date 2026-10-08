import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/useAuth";
import { useEffect } from "react";

function Layout() {
  const { user } = useAuth();

  useEffect(() => {
    let isCompact = false;
    if (user && user.preferences) {
      let prefs = user.preferences;
      if (typeof prefs === "string") {
        try {
          prefs = JSON.parse(prefs);
        } catch (e) {
          prefs = {};
        }
      }
      isCompact = !!prefs.compactMode;
    }

    if (isCompact) {
      document.body.classList.add("compact-mode");
    } else {
      document.body.classList.remove("compact-mode");
    }
  }, [user]);
  return (
    <div className="app-shell">
  <Header />

  <div className="app-body">
    <aside className="app-sidebar">
      <Sidebar />
    </aside>

    <main className="app-main">
      <div className="main-content">
        <Outlet />
      </div>
    </main>
  </div>
</div>
  );
}

export default Layout;