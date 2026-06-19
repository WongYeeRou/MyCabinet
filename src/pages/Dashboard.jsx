import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import Layout from "../components/Layout";
import { auth, db } from "../firebase";

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("user");
  const [activeOrders, setActiveOrders] = useState(0);
  const [upcomingPayments, setUpcomingPayments] = useState(0);
  const [collectionItems, setCollectionItems] = useState(0);
  const [spending, setSpending] = useState(0);
  const [recentReminders, setRecentReminders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          setUsername(userDoc.data().name);
        }

        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        );

        const ordersSnapshot = await getDocs(ordersQuery);

        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        orders.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        const active = orders.filter(
          (order) => order.status !== "Completed"
        ).length;

        const upcoming = orders.filter(
          (order) =>
            order.status !== "Completed" &&
            order.finalDate &&
            order.finalAmount > 0
        ).length;

        const totalSpending = orders.reduce(
          (sum, order) => sum + (Number(order.totalCost) || 0),
          0
        );

        setActiveOrders(active);
        setUpcomingPayments(upcoming);
        setSpending(totalSpending);
        setRecentOrders(orders.slice(0, 2));
        setRecentReminders(
          orders
            .filter((order) => order.finalDate && order.status !== "Completed")
            .slice(0, 2)
        );

        const collectionQuery = query(
          collection(db, "collections"),
          where("userId", "==", currentUser.uid)
        );

        const collectionSnapshot = await getDocs(collectionQuery);
        setCollectionItems(collectionSnapshot.size);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <Layout>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>Welcome back, {username}</p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <span>Active Orders</span>
          <strong>{activeOrders}</strong>
        </div>

        <div style={styles.card}>
          <span>Upcoming Payments</span>
          <strong>{upcomingPayments}</strong>
        </div>

        <div style={styles.card}>
          <span>Collection Items</span>
          <strong>{collectionItems}</strong>
        </div>

        <div style={styles.card}>
          <span>Spending</span>
          <strong>RM {spending}</strong>
        </div>
      </div>

      <div style={styles.row}>
        <section style={styles.box}>
          <div style={styles.headerRow}>
            <span>Payment Reminders</span>
            <span
              style={styles.viewAll}
              onClick={() => navigate("/payment-reminders")}
            >
              View All →
            </span>
          </div>

          {recentReminders.length === 0 ? (
            <p style={styles.itemText}>No upcoming payment reminders.</p>
          ) : (
            recentReminders.map((order) => (
              <div key={order.id} style={styles.item}>
                <p style={styles.itemTitle}>{order.itemName}</p>
                <p style={styles.itemText}>
                  Final payment due: {order.finalDate}
                </p>
                <hr />
              </div>
            ))
          )}
        </section>

        <section style={styles.box}>
          <div style={styles.headerRow}>
            <span>Order Status</span>
            <span
              style={styles.viewAll}
              onClick={() => navigate("/orders")}
            >
              View All →
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <p style={styles.itemText}>No orders found.</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} style={styles.item}>
                <p style={styles.itemTitle}>{order.itemName}</p>
                <p style={styles.itemText}>{order.status}</p>
                <hr />
              </div>
            ))
          )}
        </section>
      </div>

      <section style={styles.chartBox}>
        <h3>Monthly Spending</h3>
        <div style={styles.chartPlaceholder}>
          RM {spending}
        </div>
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
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "600"
  }
};

export default Dashboard;