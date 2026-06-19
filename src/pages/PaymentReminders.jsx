import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, updateDoc, where, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

function PaymentReminders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

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

    const snapshot = await getDocs(q);

    const orderList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setOrders(
      orderList.filter(
        (order) =>
          order.status !== "Awaiting Shipment" &&
          order.status !== "Shipped" &&
          order.status !== "Arrived"
      )
    );
  };

  const getDaysLeft = (dateString) => {
    if (!dateString) return null;

    const today = new Date();
    const dueDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  };

  const urgentOrders = orders.filter((order) => {
    const days = getDaysLeft(order.finalDate);
    return days !== null && days <= 7;
  });

  const upcomingOrders = orders.filter((order) => {
    const days = getDaysLeft(order.finalDate);
    return days !== null && days > 7 && days <= 30;
  });

  const waitingOrders = orders.filter((order) => !order.finalDate);

  const futureOrders = orders.filter((order) => {
  const days = getDaysLeft(order.finalDate);
  return days !== null && days > 30;
  });

  const totalUpcoming = orders.reduce((sum, order) => {
    if (!order.finalDate) return sum;
    return sum + (Number(order.finalAmount) || 0);
  }, 0);

  const handleMarkAsPaid = async (orderId) => {
  await updateDoc(doc(db, "orders", orderId), {
    status: "Awaiting Shipment"
  });

  alert("Final payment recorded. Status updated to Awaiting Shipment.");
  fetchOrders();
};

  return (
    <Layout>
      <h1 style={styles.title}>Payment Reminders</h1>
      <p style={styles.subtitle}>Stay on top of your deposits and final payments</p>

      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          Overdue / This Week<br />
          <strong>{urgentOrders.length}</strong>
        </div>

        <div style={styles.summaryCard}>
          Due Within 30 Days<br />
          <strong>{upcomingOrders.length}</strong>
        </div>

        <div style={styles.summaryCard}>
          Waiting<br />
          <strong>{waitingOrders.length}</strong>
       </div>

        <div style={styles.summaryCard}>
          Not Urgent
          <strong>{futureOrders.length}</strong>
        </div>

        <div style={styles.summaryCard}>
          Total Upcoming<br />
          <strong>RM {totalUpcoming}</strong>
        </div>
      </div>

      <ReminderSection
        title="URGENT - OVERDUE / WITHIN 7 DAYS"
        orders={urgentOrders}
        getDaysLeft={getDaysLeft}
        onView={(id) => navigate("/orders")}
        onMarkAsPaid={handleMarkAsPaid}
      />

      <ReminderSection
        title="UPCOMING - DUE WITHIN 30 DAYS"
        orders={upcomingOrders}
        getDaysLeft={getDaysLeft}
        onView={(id) => navigate("/orders")}
        onMarkAsPaid={handleMarkAsPaid}
      />

      <ReminderSection
        title="WAITING - NO FIXED DEADLINE YET"
        orders={waitingOrders}
        getDaysLeft={getDaysLeft}
        onView={(id) => navigate("/orders")}
        onMarkAsPaid={handleMarkAsPaid}
      />

      <ReminderSection
        title="NOT URGENT - MORE THAN 30 DAYS"
        orders={futureOrders}
        getDaysLeft={getDaysLeft}
        onView={(id) => navigate("/orders")}
        onMarkAsPaid={handleMarkAsPaid}
      />

    </Layout>
  );
}

function ReminderSection({ title, orders, getDaysLeft, onView, onMarkAsPaid }) {
  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>

      {orders.length === 0 ? (
        <p style={styles.emptyText}>No orders in this section.</p>
      ) : (
        orders.map((order) => {
          const daysLeft = getDaysLeft(order.finalDate);

          let dueText = "No fixed deadline";

          if (daysLeft !== null) {
            if (daysLeft < 0) {
              dueText = `Overdue by ${Math.abs(daysLeft)} day(s)`;
            } else if (daysLeft === 0) {
              dueText = "Due today";
            } else {
              dueText = `Due in ${daysLeft} day(s)`;
            }
          }

          return (
            <div style={styles.reminderCard} key={order.id}>
              <div style={styles.imageBox}>No Image</div>

              <div style={styles.info}>
                <strong>{order.itemName}</strong>
                <p>{order.status}</p>
                <p>{order.finalDate || "No date"} | {dueText}</p>
              </div>

              <div style={styles.amount}>
                RM {order.finalAmount || 0}
              </div>

              <button style={styles.smallBtn} onClick={() => onView(order.id)}>
                View
              </button>

              <button style={styles.smallBtn} onClick={() => onMarkAsPaid(order.id)}>
                Mark as paid
              </button>
            </div>
          );
        })
      )}
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
    width: "130px",
    height: "70px",
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
    width: "760px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    backgroundColor: "white",
    marginBottom: "12px"
  },

  imageBox: {
    width: "60px",
    height: "60px",
    border: "1px solid #999",
    backgroundColor: "#f7f7f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
    fontSize: "12px"
  },

  info: {
    width: "260px"
  },

  amount: {
    width: "90px",
    fontWeight: "600"
  },

  smallBtn: {
    padding: "6px 12px",
    border: "1px solid #999",
    backgroundColor: "white",
    cursor: "pointer"
  },

  emptyText: {
    color: "#666"
  }
};

export default PaymentReminders;