import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc
} from "firebase/firestore";
import { auth, db } from "../firebase";

function Sidebar() {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    list.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });

    setNotifications(list);
  };

  const unreadCount = notifications.filter((noti) => !noti.isRead).length;

  const handleMarkAsRead = async (notiId) => {
    await updateDoc(doc(db, "notifications", notiId), {
      isRead: true
    });

    fetchNotifications();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoRow}>
        <div style={styles.logo}>
          <button
            style={styles.bellBtn}
            onClick={() => setShowNotifications(true)}
          >
            🔔
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount}</span>
            )}
          </button>
        </div>

        <span style={styles.logoText} onClick={() => navigate("/profile")}>
          My Cabinet
        </span>
      </div>

      {showNotifications && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Notifications</h3>

              <button
                style={styles.closeBtn}
                onClick={() => setShowNotifications(false)}
              >
                ×
              </button>
            </div>

            {notifications.length === 0 ? (
              <p style={styles.emptyText}>No notifications.</p>
            ) : (
              notifications.map((noti) => (
                <div
                  key={noti.id}
                  style={noti.isRead ? styles.readNoti : styles.unreadNoti}
                >
                  <p style={styles.notiMessage}>{noti.message}</p>

                  {!noti.isRead && (
                    <button
                      style={styles.readBtn}
                      onClick={() => handleMarkAsRead(noti.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

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
    backgroundColor: "#f8f8f8",
    position: "relative"
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
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  bellBtn: {
    position: "relative",
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer"
  },

  badge: {
    position: "absolute",
    top: "-8px",
    right: "-10px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: "11px",
    padding: "2px 6px"
  },

  logoText: {
    fontSize: "20px",
    fontWeight: "600",
    cursor: "pointer"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999
  },

  modal: {
    width: "420px",
    maxHeight: "500px",
    overflowY: "auto",
    background: "white",
    border: "1px solid #999",
    borderRadius: "10px",
    padding: "20px"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },

  modalTitle: {
    margin: 0
  },

  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "26px",
    cursor: "pointer"
  },

  unreadNoti: {
    border: "1px solid #ddd",
    padding: "12px",
    background: "#fff4d6",
    marginBottom: "10px",
    borderRadius: "8px"
  },

  readNoti: {
    border: "1px solid #ddd",
    padding: "12px",
    background: "#f5f5f5",
    color: "#777",
    marginBottom: "10px",
    borderRadius: "8px"
  },

  notiMessage: {
    margin: "0 0 8px",
    fontSize: "14px",
    lineHeight: "1.5"
  },

  readBtn: {
    fontSize: "12px",
    padding: "5px 10px",
    cursor: "pointer"
  },

  emptyText: {
    fontSize: "14px",
    color: "#666"
  },

  logoutBtn: {
    margin: "25px",
    padding: "10px",
    width: "160px",
    cursor: "pointer"
  }
};

export default Sidebar;