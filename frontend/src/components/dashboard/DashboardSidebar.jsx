import React from "react";
import { sidebarSections } from "./sidebarConfig";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DashboardSidebar = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { hasPermission, isAdmin } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onCloseMobile} />
      )}
      <aside
        className={`dashboard-sidebar ${collapsed ? "collapsed" : "expanded"} ${mobileOpen ? "mobile-open" : ""}`}
      >
        <div className="sidebar-logo">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#00ffcc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#000", fontWeight: 800, fontSize: 14 }}>
              S
            </span>
          </div>
          {!collapsed && <h3>Soshell Admin</h3>}
        </div>

        <nav style={{ flex: 1, padding: "8px 0" }}>
          {sidebarSections.map((section) => {
            if (section.adminOnly && !isAdmin()) return null;

            const visibleItems = section.items.filter((item) =>
              hasPermission(item.feature, "view"),
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label}>
                {!collapsed && (
                  <div className="sidebar-section-title">{section.label}</div>
                )}
                {collapsed && (
                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,0.06)",
                      margin: "8px 12px",
                    }}
                  />
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
                      onClick={() => {
                        onTabChange(item.key);
                        onCloseMobile();
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="sidebar-icon" size={20} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-toggle" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
