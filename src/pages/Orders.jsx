import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/");
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        const orderList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        orderList.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setOrders(orderList);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchOrders();
  }, [navigate]);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getPaymentText = (order) => {
    if (order.fullPaymentAmount > 0) return "Fully Paid";
    if (order.depositAmount > 0 && order.finalAmount > 0) return "Deposit Paid";
    return "-";
  };

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Manage all your BJD presale orders</p>
        </div>

        <button style={styles.addBtn} onClick={() => navigate("/add-order")}>
          + Add New Order
        </button>
      </div>

      <div style={styles.filters}>
        {["All", "In Production", "Awaiting Final Payment", "Shipped", "Completed"].map((status) => (
          <button
            key={status}
            style={filter === status ? styles.activeFilter : styles.filter}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Item</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Order Date</th>
            <th style={styles.th}>Payment</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Due Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td style={styles.emptyTd} colSpan="6">
                No orders found.
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td style={styles.td}>{order.itemName}</td>
                <td style={styles.td}>{order.itemType}</td>
                <td style={styles.td}>{order.orderDate || "-"}</td>
                <td style={styles.td}>{getPaymentText(order)}</td>
                <td style={styles.td}>{order.status}</td>
                <td style={styles.td}>{order.finalDate || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Layout>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  title: {
    margin: 0
  },

  subtitle: {
    color: "#666",
    marginTop: "5px"
  },

  addBtn: {
    padding: "8px 14px",
    cursor: "pointer",
    border: "1px solid #999",
    background: "white",
    borderRadius: "4px"
  },

  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  filter: {
    padding: "6px 12px",
    border: "1px solid #999",
    borderRadius: "20px",
    background: "white",
    cursor: "pointer"
  },

  activeFilter: {
    padding: "6px 12px",
    border: "1px solid #999",
    borderRadius: "20px",
    background: "#c9c1c1",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    border: "1px solid #999",
    padding: "10px",
    textAlign: "left",
    background: "#f5f5f5"
  },

  td: {
    border: "1px solid #999",
    padding: "10px"
  },

  emptyTd: {
    border: "1px solid #999",
    padding: "20px",
    textAlign: "center"
  }
};

export default Orders;