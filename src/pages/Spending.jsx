import Layout from "../components/Layout";

function Spending() {
  return (
    <Layout>
      <h1 style={styles.title}>Spending</h1>
      <p style={styles.subtitle}>Track how much you have spent on your BJD hobby</p>

      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>Total spent<br /><strong>RM 2555</strong></div>
        <div style={styles.summaryCard}>This month<br /><strong>RM 200</strong></div>
        <div style={styles.summaryCard}>Avg per month<br /><strong>RM 548</strong></div>
        <div style={styles.summaryCard}>Upcoming payments<br /><strong>RM 700</strong></div>
      </div>

      <section style={styles.categoryBox}>
        <h3 style={styles.boxTitle}>By Category</h3>

        <div style={styles.categoryContent}>
          <div style={styles.circle}>Chart</div>

          <div style={styles.categoryList}>
            <p>Full Doll 38%</p>
            <p>Body 10%</p>
            <p>Head 23%</p>
            <p>Eyes 8%</p>
            <p>Outfit 45%</p>
          </div>
        </div>
      </section>

      <section style={styles.monthlyBox}>
        <h3 style={styles.boxTitle}>Monthly Spending - 2026</h3>
        <div style={styles.chartBox}>Chart</div>
      </section>
    </Layout>
  );
}

const styles = {
  title: {
    margin: 0
  },

  subtitle: {
    color: "#555",
    marginTop: "5px"
  },

  summaryRow: {
    display: "flex",
    gap: "12px",
    margin: "22px 0"
  },

  summaryCard: {
    border: "1px solid #999",
    width: "120px",
    height: "70px",
    padding: "8px",
    textAlign: "center",
    fontSize: "13px",
    background: "white"
  },

  categoryBox: {
    border: "1px solid #999",
    borderRadius: "10px",
    width: "650px",
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
    justifyContent: "space-around"
  },

  circle: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    background: "#d9d9d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  categoryList: {
    lineHeight: "1.8"
  },

  monthlyBox: {
    border: "1px solid #999",
    borderRadius: "10px",
    width: "420px",
    padding: "18px"
  },

  chartBox: {
    width: "300px",
    height: "120px",
    background: "#d9d9d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto"
  }
};

export default Spending;