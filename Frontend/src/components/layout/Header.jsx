import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import logo from "../../assets/logo.jpg";

function Header() {
  const [open, setOpen] =
    useState(false);

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="app-header">

      <div className="header-left">

        <div className="logo" style={{ background: 'transparent', padding: 0 }}>
          <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
        </div>

        <h1>
          Material Stock Management
        </h1>

      </div>

      <div className="header-user">

        <button
          type="button"
          className="user-button"
          onClick={() =>
            setOpen(
              (value) => !value
            )
          }
        >

          <span className="user-avatar">
            {user?.fullName
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </span>

          <span className="user-name">
            {user?.fullName || "User"}
          </span>

          <span>
            ▼
          </span>

        </button>

        {open && (
          <div className="user-menu">

            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
            >
              Profile
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/settings")
              }
            >
              Preferences
            </button>

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
}

export default Header;