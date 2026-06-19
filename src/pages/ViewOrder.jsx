import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editable, setEditable] = useState(false);
  const [userId, setUserId] = useState("");

  const [itemName, setItemName] = useState("");
  const [maker, setMaker] = useState("");
  const [itemType, setItemType] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [notes, setNotes] = useState("");

  const [fullPaymentAmount, setFullPaymentAmount] = useState("");
  const [fullPaymentDate, setFullPaymentDate] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDate, setDepositDate] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [status, setStatus] = useState("");

  const totalCost =
    Number(fullPaymentAmount) > 0
      ? Number(fullPaymentAmount)
      : (Number(depositAmount) || 0) + (Number(finalAmount) || 0);

  useEffect(() => {
    const fetchOrder = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/");
        return;
      }

      const orderDoc = await getDoc(doc(db, "orders", id));

      if (!orderDoc.exists()) {
        alert("Order not found.");
        navigate("/orders");
        return;
      }

      const data = orderDoc.data();

      if (data.userId !== currentUser.uid) {
        alert("You do not have permission to view this order.");
        navigate("/orders");
        return;
      }

      setUserId(data.userId || "");
      setItemName(data.itemName || "");
      setMaker(data.maker || "");
      setItemType(data.itemType || "");
      setOrderDate(data.orderDate || "");
      setNotes(data.notes || "");

      setFullPaymentAmount(data.fullPaymentAmount || "");
      setFullPaymentDate(data.fullPaymentDate || "");
      setDepositAmount(data.depositAmount || "");
      setDepositDate(data.depositDate || "");
      setFinalAmount(data.finalAmount || "");
      setFinalDate(data.finalDate || "");
      setStatus(data.status || "");
    };

    fetchOrder();
  }, [id, navigate]);

  const checkCollectionDuplicate = async () => {
    const q = query(
      collection(db, "collections"),
      where("sourceOrderId", "==", id)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const addOrderToCollection = async () => {
    const alreadyAdded = await checkCollectionDuplicate();

    if (alreadyAdded) {
      alert("This order has already been added to your collection.");
      return;
    }

    await addDoc(collection(db, "collections"), {
      userId,
      sourceOrderId: id,
      itemName,
      maker,
      itemType,
      dateAcquired: new Date().toISOString().slice(0, 10),
      purchasePrice: Number(totalCost) || 0,
      notes,
      createdAt: serverTimestamp()
    });

    alert("Item added to collection.");
  };

  const handleSave = async () => {
    if (!itemName || !maker || !itemType || !orderDate || !status) {
      alert("Please fill in item name, maker, item type, order date and status.");
      return;
    }

    const confirmSave = window.confirm("Are you sure you want to save these changes?");

    if (!confirmSave) return;

    await updateDoc(doc(db, "orders", id), {
      itemName,
      maker,
      itemType,
      orderDate,
      notes,
      fullPaymentAmount: Number(fullPaymentAmount) || 0,
      fullPaymentDate,
      depositAmount: Number(depositAmount) || 0,
      depositDate,
      finalAmount: Number(finalAmount) || 0,
      finalDate,
      totalCost,
      status
    });

    if (status === "Received") {
      const confirmAdd = window.confirm(
        "This order is marked as Received. Do you want to add it to your Collection?"
      );

      if (confirmAdd) {
        await addOrderToCollection();
      }
    }

    alert("Order updated successfully.");
    setEditable(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete order "${itemName}"?`);

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "orders", id));

    alert("Order deleted successfully.");
    navigate("/orders");
  };

  return (
    <Layout>
      <h1 style={styles.title}>Order Details</h1>
      <p style={styles.subtitle}>View and manage selected order</p>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Item Details</h3>

        <div style={styles.imageBox}>No Image</div>

        <div style={styles.grid}>
          <input style={styles.input} value={itemName} disabled={!editable} onChange={(e) => setItemName(e.target.value)} />
          <input style={styles.input} value={maker} disabled={!editable} onChange={(e) => setMaker(e.target.value)} />
          <input style={styles.input} value={itemType} disabled={!editable} onChange={(e) => setItemType(e.target.value)} />
          <input style={styles.input} type="date" value={orderDate} disabled={!editable} onChange={(e) => setOrderDate(e.target.value)} />
        </div>

        <textarea style={styles.notes} value={notes} disabled={!editable} onChange={(e) => setNotes(e.target.value)}></textarea>
      </section>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Payment Stages</h3>

        <div style={styles.paymentGrid}>
          <div>
            <label>Full Payment</label>
            <input style={styles.smallInput} type="number" value={fullPaymentAmount} disabled={!editable} onChange={(e) => setFullPaymentAmount(e.target.value)} />
            <input style={styles.smallInput} type="date" value={fullPaymentDate} disabled={!editable} onChange={(e) => setFullPaymentDate(e.target.value)} />
          </div>

          <div>
            <label>Deposit</label>
            <input style={styles.smallInput} type="number" value={depositAmount} disabled={!editable} onChange={(e) => setDepositAmount(e.target.value)} />
            <input style={styles.smallInput} type="date" value={depositDate} disabled={!editable} onChange={(e) => setDepositDate(e.target.value)} />
          </div>

          <div>
            <label>Final Payment</label>
            <input style={styles.smallInput} type="number" value={finalAmount} disabled={!editable} onChange={(e) => setFinalAmount(e.target.value)} />
            <input style={styles.smallInput} type="date" value={finalDate} disabled={!editable} onChange={(e) => setFinalDate(e.target.value)} />
          </div>

          <div>
            <label>Total Cost</label>
            <input style={styles.smallInput} value={totalCost} disabled />
          </div>
        </div>
      </section>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Order Status</h3>

        <select style={styles.statusInput} value={status} disabled={!editable} onChange={(e) => setStatus(e.target.value)}>
          <option value="Awaiting Final Payment">Awaiting Final Payment</option>
          <option value="Awaiting Shipment">Awaiting Shipment</option>
          <option value="Shipped">Shipped</option>
          <option value="Received">Received</option>
        </select>
      </section>

      <div style={styles.actions}>
        <button style={styles.btn} onClick={() => navigate("/orders")}>Back</button>

        <button style={styles.deleteBtn} onClick={handleDelete}>
          Delete Order
        </button>

        {!editable ? (
          <button style={styles.btn} onClick={() => setEditable(true)}>Manage</button>
        ) : (
          <button style={styles.btn} onClick={handleSave}>Save Changes</button>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  title: { margin: 0 },
  subtitle: { marginTop: "5px", color: "#555" },
  formBox: { border: "1px solid #999", borderRadius: "10px", width: "700px", padding: "18px", marginTop: "20px" },
  sectionTitle: { fontSize: "15px", fontWeight: "500", borderBottom: "1px solid #999", paddingBottom: "8px", marginTop: 0 },
  imageBox: { height: "120px", border: "1px solid #999", marginTop: "15px", marginBottom: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: "#777" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" },
  input: { padding: "10px 14px", border: "1px solid #999", borderRadius: "8px" },
  notes: { marginTop: "18px", width: "100%", height: "80px", padding: "10px", border: "1px solid #999", borderRadius: "8px", boxSizing: "border-box" },
  paymentGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" },
  smallInput: { width: "100%", padding: "8px", border: "1px solid #999", borderRadius: "8px", marginTop: "8px", boxSizing: "border-box" },
  statusInput: { width: "260px", padding: "10px", border: "1px solid #999", borderRadius: "8px" },
  actions: { width: "740px", display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" },
  btn: { padding: "8px 18px", border: "1px solid #999", borderRadius: "8px", background: "white", cursor: "pointer" },
  deleteBtn: { padding: "8px 18px", border: "1px solid #999", borderRadius: "8px", background: "#f7d6d6", cursor: "pointer" }
};

export default ViewOrder;