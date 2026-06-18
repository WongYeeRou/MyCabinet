import Layout from "../components/Layout";

function AddNewOrder() {
  return (
    <Layout>
      <h1 style={styles.title}>Add New Order</h1>
      <p style={styles.subtitle}>Track a new BJD presale order</p>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Item Details</h3>

        <div style={styles.grid}>
          <input style={styles.input} placeholder="Item Name" />
          <input style={styles.input} placeholder="Maker" />
          <input style={styles.input} placeholder="Item Type / Category" />
          <input style={styles.input} placeholder="Order Date" />
        </div>

        <textarea style={styles.notes} placeholder="Notes"></textarea>
      </section>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Payment Stages</h3>

        <div style={styles.paymentGrid}>
          <div>
            <label>Full Payment</label>
            <input style={styles.smallInput} placeholder="Amount" />
            <input style={styles.smallInput} placeholder="Date Paid" />
          </div>

          <div>
            <label>Deposit</label>
            <input style={styles.smallInput} placeholder="Amount" />
            <input style={styles.smallInput} placeholder="Date Paid" />
          </div>

          <div>
            <label>Final Payment</label>
            <input style={styles.smallInput} placeholder="Amount" />
            <input style={styles.smallInput} placeholder="Date Paid" />
          </div>

          <div>
            <label>Total Cost</label>
            <input style={styles.smallInput} placeholder="Total" />
          </div>
        </div>
      </section>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Order Status</h3>
        <input style={styles.statusInput} placeholder="Current Status" />
      </section>

      <div style={styles.actions}>
        <button style={styles.btn}>Cancel</button>
        <button style={styles.btn}>Save Order</button>
      </div>
    </Layout>
  );
}

const styles = {
  title: { margin: 0 },
  subtitle: { marginTop: "5px", color: "#555" },

  formBox: {
    border: "1px solid #999",
    borderRadius: "10px",
    width: "620px",
    padding: "18px",
    marginTop: "20px"
  },

  sectionTitle: {
    fontSize: "15px",
    fontWeight: "500",
    borderBottom: "1px solid #999",
    paddingBottom: "8px",
    marginTop: 0
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginTop: "20px"
  },

  input: {
    padding: "10px 14px",
    border: "1px solid #999",
    borderRadius: "8px"
  },

  notes: {
    marginTop: "18px",
    width: "100%",
    height: "80px",
    padding: "10px",
    border: "1px solid #999",
    borderRadius: "8px",
    boxSizing: "border-box"
  },

  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px"
  },

  smallInput: {
    width: "100%",
    padding: "8px",
    border: "1px solid #999",
    borderRadius: "8px",
    marginTop: "8px",
    boxSizing: "border-box"
  },

  statusInput: {
    width: "260px",
    padding: "10px",
    border: "1px solid #999",
    borderRadius: "8px"
  },

  actions: {
    width: "660px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "20px"
  },

  btn: {
    padding: "8px 18px",
    border: "1px solid #999",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer"
  }
};

export default AddNewOrder;