import Layout from "../components/Layout";

function Orders() {
  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>
            Manage all your BJD presale orders
          </p>
        </div>

        <button style={styles.addBtn}>
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
            <th>Item</th>
            <th>Type</th>
            <th>Order Date</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Luts 75 Head</td>
            <td>Head</td>
            <td>2 January 2026</td>
            <td>Deposit Paid</td>
            <td>Awaiting Final</td>
            <td>5 June 2026</td>
          </tr>

          <tr>
            <td>Eyes 14/6 Xavier</td>
            <td>Eyes</td>
            <td>15 February 2026</td>
            <td>Fully Paid</td>
            <td>In Production</td>
            <td>-</td>
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
  }
};

export default Orders;