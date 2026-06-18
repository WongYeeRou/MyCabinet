import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoRow}>
        <div style={styles.logo}></div>
        <span style={styles.logoText}>My Cabinet</span>
      </div>

      <nav>
        <NavLink to="/dashboard" style={getLinkStyle}>Dashboard</NavLink>
        <NavLink to="/orders" style={getLinkStyle}>Orders</NavLink>
        <NavLink to="/payment-reminders" style={getLinkStyle}>Payment Reminders</NavLink>
        <NavLink to="/collection" style={getLinkStyle}>My Collection</NavLink>
        <NavLink to="/spending" style={getLinkStyle}>Spending</NavLink>
      </nav>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

const getLinkStyle = ({ isActive }) => ({
  display: "block",
  padding: "18px",
  color: "black",
  textDecoration: "none",
  backgroundColor: isActive ? "#c9c1c1" : "transparent",
  fontSize: "18px",
  borderBottom: "1px solid #ddd",
  textAlign: "center"
});

const styles = {
  sidebar: {
    width: "210px",
    minHeight: "100vh",
    borderRight: "1px solid #999",
    backgroundColor: "#f8f8f8"
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "25px"
  },
  logo: {
    width: "50px",
    height: "60px",
    border: "1px solid #777",
    backgroundColor: "white"
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "600"
  },
  logoutBtn: {
    margin: "25px",
    padding: "10px",
    width: "160px",
    cursor: "pointer"
  }
};

export default Sidebar;