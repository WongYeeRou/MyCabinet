import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
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

      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      const orderList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      const statusOrder = {
        "Awaiting Final Payment": 1,
        "Awaiting Shipment": 2,
        Shipped: 3,
        Received: 4
      };

      orderList.sort((a, b) => {
        const statusA = statusOrder[a.status] || 99;
        const statusB = statusOrder[b.status] || 99;

        if (statusA !== statusB) {
          return statusA - statusB;
        }

        const dateA = a.finalDate
          ? new Date(a.finalDate).getTime()
          : Number.MAX_SAFE_INTEGER;

        const dateB = b.finalDate
          ? new Date(b.finalDate).getTime()
          : Number.MAX_SAFE_INTEGER;

        return dateA - dateB;
      });

      setOrders(orderList);
    };

    fetchOrders();
  }, [navigate]);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getPaymentText = (order) => {
    switch (order.status) {
      case "Awaiting Final Payment":
        return "Deposit Paid";

      case "Awaiting Shipment":
        return "Final Payment Made";

      case "Shipped":
        return "Completed";

      case "Received":
        return "Completed";

      default:
        return "-";
    }
  };

  const getDueDateText = (order) => {
    if (order.status === "Awaiting Final Payment") {
      return order.finalDate || "-";
    }

    return "-";
  };

  return (
    <Layout>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Manage all your BJD presale orders</p>
        </div>

        <button style={styles.addBtn} onClick={() => navigate("/add-order")}>
          + Add New Order
        </button>
      </div>

      <div style={styles.filters}>
        {[
          "All",
          "Awaiting Final Payment",
          "Awaiting Shipment",
          "Shipped",
          "Received"
        ].map((status) => (
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
              <tr
                key={order.id}
                style={styles.clickableRow}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <td style={styles.td}>
                  <div style={styles.itemCell}>
                    {order.imageData ? (
                      <img
                        src={order.imageData}
                        alt={order.itemName}
                        style={styles.orderImage}
                      />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}

                    <span>{order.itemName}</span>
                  </div>
                </td>

                <td style={styles.td}>{order.itemType}</td>
                <td style={styles.td}>{order.orderDate || "-"}</td>
                <td style={styles.td}>{getPaymentText(order)}</td>
                <td style={styles.td}>{order.status}</td>
                <td style={styles.td}>{getDueDateText(order)}</td>
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
    margin: 0,
    fontSize: "30px"
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
  },

  clickableRow: {
    cursor: "pointer"
  },

  itemCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  orderImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  noImage: {
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "10px",
    color: "#777"
  }
};

export default Orders;