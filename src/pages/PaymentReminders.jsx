import Layout from "../components/Layout";

function PaymentReminders() {
  return (
    <Layout>
      <h1 style={styles.title}>Payment Reminders</h1>
      <p style={styles.subtitle}>Stay on top of your deposits and final payments</p>

      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>Overdue / This Week<br /><strong>5</strong></div>
        <div style={styles.summaryCard}>Due Within 30 Days<br /><strong>5</strong></div>
        <div style={styles.summaryCard}>Waiting<br /><strong>5</strong></div>
        <div style={styles.summaryCard}>Total Upcoming<br /><strong>RM 1508</strong></div>
      </div>

      <ReminderSection title="URGENT - OVERDUE / WITHIN 7 DAYS" />
      <ReminderSection title="UPCOMING - DUE WITHIN 30 DAYS" />
      <ReminderSection title="WAITING - NO FIXED DATELINE YET" />
    </Layout>
  );
}

function ReminderSection({ title }) {
  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>

      <div style={styles.reminderCard}>
        <div style={styles.imageBox}></div>

        <div style={styles.info}>
          <strong>Item Name</strong>
          <p>Status</p>
          <p>Due Date | Within</p>
        </div>

        <div style={styles.amount}>Amount</div>

        <button style={styles.smallBtn}>View</button>
        <button style={styles.smallBtn}>Mark as paid</button>
      </div>
    </section>
  );
}

const styles = {
  title: { marginBottom: "5px" },
  subtitle: { marginTop: 0, color: "#555" },

  summaryRow: {
    display: "flex",
    gap: "12px",
    margin: "20px 0"
  },

  summaryCard: {
    border: "1px solid #999",
    width: "115px",
    height: "65px",
    padding: "8px",
    textAlign: "center",
    fontSize: "12px",
    backgroundColor: "white"
  },

  section: {
    marginTop: "22px"
  },

  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "10px"
  },

  reminderCard: {
    border: "1px solid #999",
    borderRadius: "12px",
    width: "720px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    backgroundColor: "white"
  },

  imageBox: {
    width: "60px",
    height: "60px",
    border: "1px solid #999",
    backgroundColor: "#f7f7f7"
  },

  info: {
    width: "180px"
  },

  amount: {
    width: "100px"
  },

  smallBtn: {
    padding: "6px 12px",
    border: "1px solid #999",
    backgroundColor: "white",
    cursor: "pointer"
  }
};

export default PaymentReminders;