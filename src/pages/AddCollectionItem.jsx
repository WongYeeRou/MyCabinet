import Layout from "../components/Layout";

function AddCollectionItem() {
  return (
    <Layout>
      <h1 style={styles.title}>Add Collection Item</h1>
      <p style={styles.subtitle}>Log an item you already own into your personal cabinet</p>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Item Details</h3>

        <div style={styles.grid}>
          <input style={styles.input} placeholder="Item Name" />
          <input style={styles.input} placeholder="Maker" />
          <input style={styles.input} placeholder="Item Type" />
          <input style={styles.input} placeholder="Date Acquired" />
          <input style={styles.input} placeholder="Purchase Price" />
        </div>

        <textarea style={styles.notes} placeholder="Notes"></textarea>
      </section>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Photo</h3>

        <div style={styles.photoBox}>
          Add Photo
        </div>
      </section>

      <div style={styles.actions}>
        <button style={styles.btn}>Cancel</button>
        <button style={styles.btn}>Add to Cabinet</button>
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

  photoBox: {
    border: "1px solid #999",
    borderRadius: "8px",
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15px"
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

export default AddCollectionItem;