import {
  NavLink,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/useAuth";

import {
  NAVIGATION,
} from "../../config/navigations";

function Sidebar() {
  const {
    hasPermission,
  } = useAuth();

  const canView = (item) => {
    if (!item.permission) {
      return true;
    }

    return hasPermission(
      item.permission
    );
  };

  return (
    <aside className="app-sidebar">

      <nav className="sidebar-nav">

        {NAVIGATION.map(
          (item) => {

            if (
              item.children
            ) {
              const children =
                item.children.filter(
                  canView
                );

              if (
                children.length === 0
              ) {
                return null;
              }

              return (
                <div
                  className="sidebar-section"
                  key={item.title}
                >

                  <div className="sidebar-section-title">
                    {item.title}
                  </div>

                  {children.map(
                    (child) => (
                      <NavLink
                        key={
                          child.path
                        }
                        to={
                          child.path
                        }
                        className="nav-link"
                      >
                        <span>
                          {child.title}
                        </span>
                      </NavLink>
                    )
                  )}

                </div>
              );
            }

            if (!canView(item)) {
              return null;
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="nav-link"
              >
                <span>
                  {item.title}
                </span>
              </NavLink>
            );
          }
        )}

      </nav>

    </aside>
  );
}

export default Sidebar;