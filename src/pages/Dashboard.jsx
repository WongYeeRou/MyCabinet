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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import Layout from "../components/Layout";
import { auth, db } from "../firebase";

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("user");
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState(0);
  const [upcomingPayments, setUpcomingPayments] = useState(0);
  const [collectionItems, setCollectionItems] = useState(0);
  const [spending, setSpending] = useState(0);
  const [recentReminders, setRecentReminders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));

      if (userDoc.exists()) {
        setUsername(userDoc.data().name);
      }

      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid)
      );

      const ordersSnapshot = await getDocs(ordersQuery);

      const orderList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      orderList.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      setOrders(orderList);

      setActiveOrders(
        orderList.filter((order) => order.status !== "Completed").length
      );

      setUpcomingPayments(
        orderList.filter(
          (order) =>
            order.status !== "Completed" &&
            order.finalDate &&
            order.finalAmount > 0
        ).length
      );

      setSpending(
        orderList.reduce(
          (sum, order) => sum + (Number(order.totalCost) || 0),
          0
        )
      );

      setRecentOrders(orderList.slice(0, 2));

      setRecentReminders(
        orderList
          .filter((order) => order.finalDate && order.status !== "Completed")
          .slice(0, 2)
      );

      const collectionQuery = query(
        collection(db, "collections"),
        where("userId", "==", currentUser.uid)
      );

      const collectionSnapshot = await getDocs(collectionQuery);
      setCollectionItems(collectionSnapshot.size);
    };

    fetchDashboardData();
  }, [navigate]);

  const spendingData = orders
    .filter((order) => {
      if (!order.orderDate) return false;
      return order.orderDate >= startDate && order.orderDate <= endDate;
    })
    .reduce((acc, order) => {
      const existing = acc.find((item) => item.date === order.orderDate);

      if (existing) {
        existing.amount += Number(order.totalCost) || 0;
      } else {
        acc.push({
          date: order.orderDate,
          amount: Number(order.totalCost) || 0
        });
      }

      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const selectedRangeTotal = spendingData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

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
          <span>Total Spending</span>
          <strong>RM {spending}</strong>
        </div>
      </div>

      <div style={styles.row}>
        <section style={styles.box}>
          <div style={styles.headerRow}>
            <span>Payment Reminders</span>
            <span style={styles.viewAll} onClick={() => navigate("/payment-reminders")}>
              View All →
            </span>
          </div>

          {recentReminders.length === 0 ? (
            <p style={styles.itemText}>No upcoming payment reminders.</p>
          ) : (
            recentReminders.map((order) => (
              <div key={order.id} style={styles.item}>
                <p style={styles.itemTitle}>{order.itemName}</p>
                <p style={styles.itemText}>Final payment due: {order.finalDate}</p>
                <hr />
              </div>
            ))
          )}
        </section>

        <section style={styles.box}>
          <div style={styles.headerRow}>
            <span>Order Status</span>
            <span style={styles.viewAll} onClick={() => navigate("/orders")}>
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
        <div style={styles.chartHeader}>
          <div>
            <h3 style={styles.chartTitle}>Spending</h3>
            <p style={styles.chartSubtitle}>
              Selected range total: RM {selectedRangeTotal}
            </p>
          </div>

          <div style={styles.dateControls}>
            <input
              type="date"
              style={styles.dateInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <span>to</span>

            <input
              type="date"
              style={styles.dateInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.chartArea}>
          {spendingData.length === 0 ? (
            <p>No spending data in this date range.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`RM ${value}`, "Amount"]} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
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
    maxWidth: "850px",
    minHeight: "330px",
    padding: "18px",
    backgroundColor: "#fff"
  },

  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  chartTitle: {
    margin: 0
  },

  chartSubtitle: {
    margin: "5px 0 0",
    color: "#555"
  },

  dateControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  dateInput: {
    padding: "8px",
    border: "1px solid #999",
    borderRadius: "6px"
  },

  chartArea: {
    height: "230px"
  }
};

export default Dashboard;