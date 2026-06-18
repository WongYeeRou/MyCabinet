import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Orders() {
  const navigate = useNavigate();

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
        <button style={styles.filter}>All</button>
        <button style={styles.filter}>In Production</button>
        <button style={styles.filter}>Awaiting Final</button>
        <button style={styles.filter}>Shipped</button>
        <button style={styles.filter}>Completed</button>
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
          <tr>
            <td style={styles.td}>Luts 75 Head</td>
            <td style={styles.td}>Head</td>
            <td style={styles.td}>2 January 2026</td>
            <td style={styles.td}>Deposit Paid</td>
            <td style={styles.td}>Awaiting Final</td>
            <td style={styles.td}>5 June 2026</td>
          </tr>

          <tr>
            <td style={styles.td}>Eyes 14/6 Xavier</td>
            <td style={styles.td}>Eyes</td>
            <td style={styles.td}>15 February 2026</td>
            <td style={styles.td}>Fully Paid</td>
            <td style={styles.td}>In Production</td>
            <td style={styles.td}>-</td>
          </tr>
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
    marginBottom: "20px"
  },

  filter: {
    padding: "6px 12px",
    border: "1px solid #999",
    borderRadius: "20px",
    background: "white",
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
  }
};

export default Orders;