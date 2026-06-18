import Layout from "../components/Layout";

function MyCollection() {
  const items = Array(6).fill(null);

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Collection</h1>
          <p style={styles.subtitle}>All your dolls, parts, outfits and accessories in one place</p>
        </div>

        <button style={styles.manageBtn}>Manage Item</button>
      </div>

      <div style={styles.statsBar}>
        <span>42 Total</span>
        <span>8 Full Dolls</span>
        <span>6 wigs</span>
        <span>8 eyes</span>
        <span>14 heads</span>
        <span>2 body</span>
      </div>

      <div style={styles.filterRow}>
        <button style={styles.activeFilter}>All</button>
        <button style={styles.filter}>Full Dolls</button>
        <button style={styles.filter}>wigs</button>
        <button style={styles.filter}>eyes</button>
        <button style={styles.filter}>heads</button>
        <button style={styles.filter}>body</button>
        <button style={styles.addBtn}>+ Item</button>
      </div>

      <div style={styles.grid}>
        {items.map((_, index) => (
          <div style={styles.card} key={index}>
            <div style={styles.imageBox}></div>

            <p style={styles.itemName}>Item name</p>
            <p style={styles.shop}>Shop</p>

            <div style={styles.cardBottom}>
              <span style={styles.tag}>eyes</span>
              <span>RM 85</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px"
  },

  title: {
    margin: 0
  },

  subtitle: {
    marginTop: "5px",
    color: "#555"
  },

  manageBtn: {
    padding: "7px 15px",
    border: "1px solid #999",
    background: "white",
    cursor: "pointer"
  },

  statsBar: {
    border: "1px solid #999",
    padding: "10px",
    display: "flex",
    gap: "22px",
    maxWidth: "720px",
    fontSize: "14px",
    marginBottom: "18px"
  },

  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px"
  },

  filter: {
    padding: "6px 18px",
    borderRadius: "20px",
    border: "1px solid #999",
    background: "white",
    cursor: "pointer"
  },

  activeFilter: {
    padding: "6px 18px",
    borderRadius: "20px",
    border: "1px solid #999",
    background: "#d6d0d0",
    cursor: "pointer"
  },

  addBtn: {
    padding: "6px 14px",
    border: "1px solid #999",
    background: "white",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 180px)",
    gap: "18px"
  },

  card: {
    border: "1px solid #999",
    borderRadius: "10px",
    padding: "10px",
    background: "white"
  },

  imageBox: {
    height: "110px",
    border: "1px solid #999",
    background: "#f7f7f7",
    marginBottom: "10px"
  },

  itemName: {
    margin: "0 0 3px 0",
    fontWeight: "600"
  },

  shop: {
    margin: "0 0 8px 0"
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px"
  },

  tag: {
    border: "1px solid #999",
    borderRadius: "20px",
    padding: "3px 10px"
  }
};

export default MyCollection;