import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase";

function CategoryDropdown({ value, onChange, includeAll = false, onCategoriesChange }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(
      collection(db, "categories"),
      where("userId", "==", currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    list.sort((a, b) => a.name.localeCompare(b.name));

    setCategories(list);

    if (onCategoriesChange) {
      onCategoriesChange(list);
    }
  };

  const handleAddCategory = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const trimmed = newCategory.trim();

    if (!trimmed) {
      alert("Please enter a category name.");
      return;
    }

    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      alert("This category already exists.");
      return;
    }

    await addDoc(collection(db, "categories"), {
      userId: currentUser.uid,
      name: trimmed,
      createdAt: serverTimestamp()
    });

    setNewCategory("");
    fetchCategories();
  };

  const handleDeleteCategory = async (category) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid),
      where("itemType", "==", category.name)
    );

    const collectionsQuery = query(
      collection(db, "collections"),
      where("userId", "==", currentUser.uid),
      where("itemType", "==", category.name)
    );

    const ordersSnapshot = await getDocs(ordersQuery);
    const collectionsSnapshot = await getDocs(collectionsQuery);

    if (!ordersSnapshot.empty || !collectionsSnapshot.empty) {
      alert("This category cannot be deleted because it is used by an order or collection item.");
      return;
    }

    const confirmDelete = window.confirm(`Delete category "${category.name}"?`);
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "categories", category.id));

    if (value === category.name) {
      onChange(includeAll ? "All" : "");
    }

    fetchCategories();
  };

  return (
    <div style={styles.wrapper}>
      <select
        style={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {includeAll && <option value="All">All</option>}
        {!includeAll && <option value="">Select Category</option>}

        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <div style={styles.categoryBox}>
        {categories.map((cat) => (
          <div key={cat.id} style={styles.categoryRow}>
            <span>{cat.name}</span>
            <button
              type="button"
              style={styles.deleteBtn}
              onClick={() => handleDeleteCategory(cat)}
            >
              🗑
            </button>
          </div>
        ))}

        <div style={styles.addRow}>
          <input
            style={styles.addInput}
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="button" style={styles.addBtn} onClick={handleAddCategory}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%"
  },

  select: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #999",
    borderRadius: "8px",
    background: "white"
  },

  categoryBox: {
    border: "1px solid #bbb",
    borderRadius: "8px",
    marginTop: "8px",
    padding: "8px",
    maxHeight: "150px",
    overflowY: "auto",
    background: "white"
  },

  categoryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 0",
    borderBottom: "1px solid #eee"
  },

  deleteBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer"
  },

  addRow: {
    display: "flex",
    gap: "6px",
    marginTop: "8px"
  },

  addInput: {
    flex: 1,
    padding: "7px",
    border: "1px solid #999",
    borderRadius: "6px"
  },

  addBtn: {
    padding: "7px 10px",
    border: "1px solid #999",
    background: "white",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default CategoryDropdown;