import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

function Spending() {
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showAmounts, setShowAmounts] = useState(true);

  useEffect(() => {
    fetchSpendingData();
  }, []);

  const fetchSpendingData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid)
    );

    const collectionsQuery = query(
      collection(db, "collections"),
      where("userId", "==", currentUser.uid)
    );

    const ordersSnapshot = await getDocs(ordersQuery);
    const collectionsSnapshot = await getDocs(collectionsQuery);

    setOrders(
      ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
    );

    setCollections(
      collectionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
    );
  };

  const manualCollections = collections.filter((item) => !item.sourceOrderId);

  const totalOrderSpent = orders.reduce(
    (sum, order) => sum + (Number(order.totalCost) || 0),
    0
  );

  const totalCollectionSpent = manualCollections.reduce(
    (sum, item) => sum + (Number(item.purchasePrice) || 0),
    0
  );

  const totalSpent = totalOrderSpent + totalCollectionSpent;

  const currentMonth = new Date().toISOString().slice(0, 7);

  const thisMonthOrders = orders.filter((order) =>
    order.orderDate?.startsWith(currentMonth)
  );

  const thisMonthCollections = manualCollections.filter((item) =>
    item.dateAcquired?.startsWith(currentMonth)
  );

  const thisMonthSpent =
    thisMonthOrders.reduce((sum, order) => sum + (Number(order.totalCost) || 0), 0) +
    thisMonthCollections.reduce((sum, item) => sum + (Number(item.purchasePrice) || 0), 0);

  const upcomingPayments = orders
    .filter((order) => order.status === "Awaiting Final Payment")
    .reduce((sum, order) => sum + (Number(order.finalAmount) || 0), 0);

  const monthsWithSpending = new Set();

  orders.forEach((order) => {
    if (order.orderDate) monthsWithSpending.add(order.orderDate.slice(0, 7));
  });

  manualCollections.forEach((item) => {
    if (item.dateAcquired) monthsWithSpending.add(item.dateAcquired.slice(0, 7));
  });

  const avgPerMonth =
    monthsWithSpending.size > 0
      ? Math.round(totalSpent / monthsWithSpending.size)
      : 0;

  const categoryMap = {};

  orders.forEach((order) => {
    const category = order.itemType || "Others";
    categoryMap[category] =
      (categoryMap[category] || 0) + (Number(order.totalCost) || 0);
  });

  manualCollections.forEach((item) => {
    const category = item.itemType || "Others";
    categoryMap[category] =
      (categoryMap[category] || 0) + (Number(item.purchasePrice) || 0);
  });

  const categoryData = Object.keys(categoryMap).map((category) => ({
    category,
    amount: categoryMap[category]
  }));

  const monthlyMap = {};

  orders.forEach((order) => {
    if (!order.orderDate) return;

    const month = order.orderDate.slice(0, 7);
    monthlyMap[month] =
      (monthlyMap[month] || 0) + (Number(order.totalCost) || 0);
  });

  manualCollections.forEach((item) => {
    if (!item.dateAcquired) return;

    const month = item.dateAcquired.slice(0, 7);
    monthlyMap[month] =
      (monthlyMap[month] || 0) + (Number(item.purchasePrice) || 0);
  });

  const monthlyData = Object.keys(monthlyMap)
    .sort()
    .map((month) => ({
      month,
      amount: monthlyMap[month]
    }));

  return (
    <Layout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Spending</h1>
          <p style={styles.subtitle}>
            Track how much you have spent on your BJD hobby
          </p>
        </div>

        <button
          style={styles.eyeBtn}
          onClick={() => setShowAmounts(!showAmounts)}
        >
          {showAmounts ? "👁 Show Amounts" : "🙈 Hide Amounts"}
        </button>
      </div>

      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>Total Spent<br /><strong>{showAmounts ? `RM ${totalSpent}` : "••••"}</strong></div>
        <div style={styles.summaryCard}>This Month<br /><strong>{showAmounts ? `RM ${thisMonthSpent}` : "••••"}</strong></div>
        <div style={styles.summaryCard}>Avg Per Month<br /><strong>{showAmounts ? `RM ${avgPerMonth}` : "••••"}</strong></div>
        <div style={styles.summaryCard}>Upcoming Payments<br /><strong>{showAmounts ? `RM ${upcomingPayments}` : "••••"}</strong></div>
      </div>

      <section style={styles.categoryBox}>
        <h3 style={styles.boxTitle}>By Category</h3>

        {categoryData.length === 0 ? (
          <p>No spending data yet.</p>
        ) : (
          <div style={styles.categoryContent}>
            <div style={styles.chartArea}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    outerRadius={70}
                    label
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `RM ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.categoryList}>
              {categoryData.map((item) => (
                <p key={item.category}>
                  {item.category}: {showAmounts ? `RM ${item.amount}` : "••••"}
                </p>
              ))}
            </div>
          </div>
        )}
      </section>

      <section style={styles.monthlyBox}>
        <h3 style={styles.boxTitle}>Monthly Spending</h3>

        {monthlyData.length === 0 ? (
          <p>No monthly spending data yet.</p>
        ) : (
          <div style={styles.barChartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `RM ${value}`} />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </Layout>
  );
}

const styles = {
  title: {
    margin: 0,
    fontSize: "30px"
  },

  subtitle: {
    color: "#555",
    marginTop: "5px"
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  eyeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer"
  },

  header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "25px"
},

  title: {
    margin: 0,
    fontSize: "30px"
  },

  subtitle: {
    marginTop: "8px",
    color: "#555"
  },

  eyeBtn: {
    padding: "8px 14px",
    border: "1px solid #999",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontSize: "14px"
  },

  summaryRow: {
    display: "flex",
    gap: "12px",
    margin: "22px 0",
    flexWrap: "wrap"
  },

  summaryCard: {
    border: "1px solid #999",
    width: "140px",
    height: "75px",
    padding: "8px",
    textAlign: "center",
    fontSize: "13px",
    background: "white"
  },

  categoryBox: {
    border: "1px solid #999",
    borderRadius: "10px",
    width: "720px",
    padding: "18px",
    marginBottom: "28px"
  },

  boxTitle: {
    marginTop: 0,
    fontSize: "16px"
  },

  categoryContent: {
    display: "flex",
    alignItems: "center",
    gap: "40px"
  },

  chartArea: {
    width: "250px",
    height: "220px"
  },

  categoryList: {
    lineHeight: "1.8"
  },

  monthlyBox: {
    border: "1px solid #999",
    borderRadius: "10px",
    width: "720px",
    padding: "18px"
  },

  barChartArea: {
    width: "100%",
    height: "260px"
  }
};

export default Spending;