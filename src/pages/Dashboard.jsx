import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Dashboard() {
  const [username, setUsername] = useState("user");

  useEffect(() => {
    const getUserName = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          setUsername(userDoc.data().name);
        }
      }
    };

    getUserName();
  }, []);

  return (
    <Layout>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>Welcome back, {username}</p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <span>Active Orders</span>
          <strong>5</strong>
        </div>

        <div style={styles.card}>
          <span>Upcoming Payments</span>
          <strong>5</strong>
        </div>

        <div style={styles.card}>
          <span>Collection Items</span>
          <strong>5</strong>
        </div>

        <div style={styles.card}>
          <span>Spending</span>
          <strong>RM 100</strong>
        </div>
      </div>

      <div style={styles.row}>
        <section style={styles.box}>
          <div style={styles.headerRow}>
            <span>Payment Reminders</span>
            <span style={styles.viewAll}>View All →</span>
          </div>

          <div style={styles.item}>
            <p style={styles.itemTitle}>Luts - Lishe Head</p>
            <p style={styles.itemText}>Final payment due: 5 June 2026</p>
          </div>

          <hr />

          <div style={styles.item}>
            <p style={styles.itemTitle}>Soom ID75</p>
            <p style={styles.itemText}>Final payment due: 24 June 2026</p>
          </div>
        </section>

        <section style={styles.box}>
          <div style={styles.headerRow}>
            <span>Order Status</span>
            <span style={styles.viewAll}>View All →</span>
          </div>

          <div style={styles.item}>
            <p style={styles.itemTitle}>Strawberry 3/6 Shirt</p>
            <p style={styles.itemText}>Deposit Paid</p>
          </div>

          <hr />

          <div style={styles.item}>
            <p style={styles.itemTitle}>Soom ID75</p>
            <p style={styles.itemText}>Awaiting Final Payment</p>
          </div>
        </section>
      </div>

      <section style={styles.chartBox}>
        <h3>Monthly Spending</h3>
        <div style={styles.chartPlaceholder}></div>
      </section>
    </Layout>
  );
}

const styles = {
  title: {
    marginBottom: "5px",
    fontSize: "30px"
  },

  subtitle: {
    color: "#555",
    marginBottom: "25px"
  },

  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    border: "1px solid #999",
    width: "180px",
    height: "90px",
    padding: "15px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#fff"
  },

  row: {
    display: "flex",
    gap: "25px",
    marginBottom: "30px"
  },

  box: {
    border: "1px solid #999",
    width: "360px",
    minHeight: "220px",
    padding: "18px",
    backgroundColor: "#fff"
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "600",
    marginBottom: "18px"
  },

  viewAll: {
    fontSize: "14px",
    fontWeight: "400",
    cursor: "pointer"
  },

  item: {
    marginBottom: "12px"
  },

  itemTitle: {
    margin: "0 0 5px 0",
    fontWeight: "600"
  },

  itemText: {
    margin: 0,
    color: "#444"
  },

  chartBox: {
    border: "1px solid #999",
    width: "100%",
    maxWidth: "760px",
    height: "220px",
    padding: "18px",
    backgroundColor: "#fff"
  },

  chartPlaceholder: {
    border: "1px dashed #aaa",
    height: "140px",
    marginTop: "20px"
  }
};

export default Dashboard;