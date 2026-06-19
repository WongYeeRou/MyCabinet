import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

function ViewCollectionItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editable, setEditable] = useState(false);

  const [itemName, setItemName] = useState("");
  const [maker, setMaker] = useState("");
  const [itemType, setItemType] = useState("");
  const [dateAcquired, setDateAcquired] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/");
        return;
      }

      const itemDoc = await getDoc(doc(db, "collections", id));

      if (!itemDoc.exists()) {
        alert("Item not found.");
        navigate("/collection");
        return;
      }

      const data = itemDoc.data();

      if (data.userId !== currentUser.uid) {
        alert("You do not have permission to view this item.");
        navigate("/collection");
        return;
      }

      setItemName(data.itemName || "");
      setMaker(data.maker || "");
      setItemType(data.itemType || "");
      setDateAcquired(data.dateAcquired || "");
      setPurchasePrice(data.purchasePrice || "");
      setNotes(data.notes || "");
    };

    fetchItem();
  }, [id, navigate]);

  const handleSave = async () => {
    await updateDoc(doc(db, "collections", id), {
      itemName,
      maker,
      itemType,
      dateAcquired,
      purchasePrice: Number(purchasePrice),
      notes
    });

    alert("Item updated successfully.");
    setEditable(false);
  };

  return (
    <Layout>
      <h1 style={styles.title}>Collection Item Details</h1>
      <p style={styles.subtitle}>View and manage your selected collection item</p>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Item Details</h3>

        <div style={styles.imageBox}>No Image</div>

        <div style={styles.grid}>
          <input style={styles.input} value={itemName} disabled={!editable} onChange={(e) => setItemName(e.target.value)} />
          <input style={styles.input} value={maker} disabled={!editable} onChange={(e) => setMaker(e.target.value)} />
          <input style={styles.input} value={itemType} disabled={!editable} onChange={(e) => setItemType(e.target.value)} />
          <input style={styles.input} type="date" value={dateAcquired} disabled={!editable} onChange={(e) => setDateAcquired(e.target.value)} />
          <input style={styles.input} type="number" value={purchasePrice} disabled={!editable} onChange={(e) => setPurchasePrice(e.target.value)} />
        </div>

        <textarea style={styles.notes} value={notes} disabled={!editable} onChange={(e) => setNotes(e.target.value)}></textarea>
      </section>

      <div style={styles.actions}>
        <button style={styles.btn} onClick={() => navigate("/collection")}>Back</button>

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
  formBox: { border: "1px solid #999", borderRadius: "10px", width: "620px", padding: "18px", marginTop: "20px" },
  sectionTitle: { fontSize: "15px", fontWeight: "500", borderBottom: "1px solid #999", paddingBottom: "8px", marginTop: 0 },
  imageBox: { height: "140px", border: "1px solid #999", marginTop: "15px", marginBottom: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: "#777" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" },
  input: { padding: "10px 14px", border: "1px solid #999", borderRadius: "8px" },
  notes: { marginTop: "18px", width: "100%", height: "90px", padding: "10px", border: "1px solid #999", borderRadius: "8px", boxSizing: "border-box" },
  actions: { width: "660px", display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" },
  btn: { padding: "8px 18px", border: "1px solid #999", borderRadius: "8px", background: "white", cursor: "pointer" }
};

export default ViewCollectionItem;