import { NavLink } from "react-router-dom";

const navLinkStyle = {
  fontFamily: "serif",
  textDecoration: "none",
  color: "#333",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "500",
  transition: "all 0.3s ease", // גורם לכל שינוי (צבע, רקע) לקרות בהדרגה
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...navLinkStyle,
        backgroundColor: isActive ? "#f0f4ff" : "transparent",
        color: isActive ? "#2563eb" : "#f0f4ff",
      })}
    >
      {label}
    </NavLink>
  );
}

export default NavItem;
