import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

function MyCollection() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchCollectionItems();
  }, []);

  const fetchCollectionItems = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "collections"),
      where("userId", "==", currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const itemList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setItems(itemList);
  };

  const filteredItems =
    filter === "All"
      ? items
      : items.filter((item) => item.itemType === filter);

  const getCount = (type) => {
    return items.filter((item) => item.itemType === type).length;
  };

  return (
    <Layout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Collection</h1>
          <p style={styles.subtitle}>
            All your dolls, parts, outfits and accessories in one place
          </p>
        </div>

        <button style={styles.addBtn} onClick={() => navigate("/add-collection")}>
          + Item
        </button>
      </div>

      <div style={styles.statsBar}>
        <span>{items.length} Total</span>
        <span>{getCount("Full Doll")} Full Dolls</span>
        <span>{getCount("Wig")} Wigs</span>
        <span>{getCount("Eyes")} Eyes</span>
        <span>{getCount("Head")} Heads</span>
        <span>{getCount("Body")} Body</span>
      </div>

      <div style={styles.filterRow}>
        {["All", "Full Doll", "Wig", "Eyes", "Head", "Body"].map((type) => (
          <button
            key={type}
            style={filter === type ? styles.activeFilter : styles.filter}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filteredItems.length === 0 ? (
          <p>No collection items found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => navigate(`/collection/${item.id}`)}
            >
              <div style={styles.imageBox}>No Image</div>

              <p style={styles.itemName}>{item.itemName}</p>
              <p style={styles.shop}>{item.maker}</p>

              <div style={styles.cardBottom}>
                <span style={styles.tag}>{item.itemType}</span>
                <span>RM {item.purchasePrice}</span>
              </div>
            </div>
          ))
        )}
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

  addBtn: {
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
    marginBottom: "18px",
    flexWrap: "wrap"
  },

  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap"
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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 180px)",
    gap: "18px"
  },

  card: {
    border: "1px solid #999",
    borderRadius: "10px",
    padding: "10px",
    background: "white",
    cursor: "pointer"
  },

  imageBox: {
    height: "110px",
    border: "1px solid #999",
    background: "#f7f7f7",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777"
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