import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";

const DashboardHeader = ({ title, onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getRoleBadgeClass = () => {
    if (!user) return "custom";
    if (user.isSuperAdmin) return "superadmin";
    if (user.role?.name === "Admin") return "admin";
    return "custom";
  };

  const getRoleLabel = () => {
    if (!user) return "";
    if (user.isSuperAdmin) return "SuperAdmin";
    return user.role?.name || "User";
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          <Menu size={22} />
        </button>
        <h1>{title}</h1>
      </div>

      <div className="dashboard-header-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0) || "?"}
          </div>
          <div>
            <div className="user-name">{user?.username || "User"}</div>
            <span className={`role-badge ${getRoleBadgeClass()}`}>
              {getRoleLabel()}
            </span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={14} style={{ marginRight: 6 }} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
