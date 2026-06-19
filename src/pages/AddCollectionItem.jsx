import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";
import CategoryDropdown from "../components/CategoryDropdown";

function AddCollectionItem() {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [maker, setMaker] = useState("");
  const [itemType, setItemType] = useState("");
  const [dateAcquired, setDateAcquired] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [notes, setNotes] = useState("");
  const [imageData, setImageData] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 700000) {
      alert("Image is too large. Please choose an image below 700KB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImageData(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleAddItem = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    if (!itemName || !maker || !itemType || !dateAcquired || !purchasePrice) {
      alert("Please fill in all item details.");
      return;
    }

    try {
      await addDoc(collection(db, "collections"), {
        userId: currentUser.uid,
        itemName,
        maker,
        itemType,
        dateAcquired,
        purchasePrice: Number(purchasePrice),
        notes,
        imageData,
        createdAt: serverTimestamp()
      });

      alert("Collection item added successfully!");
      navigate("/collection");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout>
      <h1 style={styles.title}>Add Collection Item</h1>
      <p style={styles.subtitle}>Log an item you already own into your personal cabinet</p>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Item Details</h3>

        <div style={styles.grid}>
          <input style={styles.input} placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
          <input style={styles.input} placeholder="Maker" value={maker} onChange={(e) => setMaker(e.target.value)} />
          <CategoryDropdown value={itemType} onChange={setItemType} />
          <input style={styles.input} type="date" value={dateAcquired} onChange={(e) => setDateAcquired(e.target.value)} />
          <input style={styles.input} type="number" placeholder="Purchase Price" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </div>

        <textarea style={styles.notes} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
      </section>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Photo</h3>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imageData ? (
          <img src={imageData} alt="Preview" style={styles.previewImage} />
        ) : (
          <div style={styles.photoBox}>No image selected</div>
        )}
      </section>

      <div style={styles.actions}>
        <button style={styles.btn} onClick={() => navigate("/collection")}>Cancel</button>
        <button style={styles.btn} onClick={handleAddItem}>Add to Cabinet</button>
      </div>
    </Layout>
  );
}

const styles = {
  title: { margin: 0, fontSize: "30px" },
  subtitle: { marginTop: "5px", color: "#555" },
  formBox: { border: "1px solid #999", borderRadius: "10px", width: "620px", padding: "18px", marginTop: "20px" },
  sectionTitle: { fontSize: "15px", fontWeight: "500", borderBottom: "1px solid #999", paddingBottom: "8px", marginTop: 0 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "20px" },
  input: { padding: "10px 14px", border: "1px solid #999", borderRadius: "8px" },
  notes: { marginTop: "18px", width: "100%", height: "80px", padding: "10px", border: "1px solid #999", borderRadius: "8px", boxSizing: "border-box" },
  photoBox: { border: "1px solid #999", borderRadius: "8px", height: "120px", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" },
  previewImage: { width: "160px", height: "160px", objectFit: "cover", border: "1px solid #999", marginTop: "12px" },
  actions: { width: "660px", display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" },
  btn: { padding: "8px 18px", border: "1px solid #999", borderRadius: "8px", background: "white", cursor: "pointer" }
};

export default AddCollectionItem;