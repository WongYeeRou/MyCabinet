import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

function AddNewOrder() {
  const navigate = useNavigate();

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
    fullPaymentAmount !== ""
      ? Number(fullPaymentAmount)
      : (Number(depositAmount) || 0) + (Number(finalAmount) || 0);

  const handleFullPaymentChange = (value) => {
    setFullPaymentAmount(value);

    if (value !== "") {
      setDepositAmount("");
      setDepositDate("");
      setFinalAmount("");
      setFinalDate("");
    }
  };

  const handleDepositChange = (value) => {
    setDepositAmount(value);

    if (value !== "") {
      setFullPaymentAmount("");
      setFullPaymentDate("");
    }
  };

  const handleFinalChange = (value) => {
    setFinalAmount(value);

    if (value !== "") {
      setFullPaymentAmount("");
      setFullPaymentDate("");
    }
  };

  const handleSaveOrder = async () => {
    if (!itemName || !maker || !itemType || !orderDate || !status) {
      alert("Please fill in item name, maker, item type, order date and status.");
      return;
    }

    if (!fullPaymentAmount && (!depositAmount || !finalAmount)) {
      alert("Please either enter full payment OR both deposit and final payment.");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
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
        status,
        createdAt: serverTimestamp()
      });

      alert("Order saved successfully!");
      navigate("/orders");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout>
      <h1 style={styles.title}>Add New Order</h1>
      <p style={styles.subtitle}>Track a new BJD presale order</p>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Item Details</h3>

        <div style={styles.grid}>
          <input style={styles.input} placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
          <input style={styles.input} placeholder="Maker" value={maker} onChange={(e) => setMaker(e.target.value)} />
          <input style={styles.input} placeholder="Item Type / Category" value={itemType} onChange={(e) => setItemType(e.target.value)} />
          <input style={styles.input} type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
        </div>

        <textarea style={styles.notes} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
      </section>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Payment Stages</h3>

        <div style={styles.paymentGrid}>
          <div>
            <label>Full Payment</label>
            <input
              style={styles.smallInput}
              type="number"
              placeholder="Amount"
              value={fullPaymentAmount}
              onChange={(e) => handleFullPaymentChange(e.target.value)}
              disabled={depositAmount !== "" || finalAmount !== ""}
            />
            <input
              style={styles.smallInput}
              type="date"
              value={fullPaymentDate}
              onChange={(e) => setFullPaymentDate(e.target.value)}
              disabled={depositAmount !== "" || finalAmount !== ""}
            />
          </div>

          <div>
            <label>Deposit</label>
            <input
              style={styles.smallInput}
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => handleDepositChange(e.target.value)}
              disabled={fullPaymentAmount !== ""}
            />
            <input
              style={styles.smallInput}
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
              disabled={fullPaymentAmount !== ""}
            />
          </div>

          <div>
            <label>Final Payment</label>
            <input
              style={styles.smallInput}
              type="number"
              placeholder="Amount"
              value={finalAmount}
              onChange={(e) => handleFinalChange(e.target.value)}
              disabled={fullPaymentAmount !== ""}
            />
            <input
              style={styles.smallInput}
              type="date"
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
              disabled={fullPaymentAmount !== ""}
            />
          </div>

          <div>
            <label>Total Cost</label>
            <input
              style={styles.smallInput}
              type="number"
              value={totalCost}
              readOnly
            />
          </div>
        </div>
      </section>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Order Status</h3>

        <select style={styles.statusInput} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Deposit Paid">Deposit Paid</option>
          <option value="Awaiting Final">Awaiting Final</option>
          <option value="In Production">In Production</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
        </select>
      </section>

      <div style={styles.actions}>
        <button style={styles.btn} onClick={() => navigate("/orders")}>Cancel</button>
        <button style={styles.btn} onClick={handleSaveOrder}>Save Order</button>
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