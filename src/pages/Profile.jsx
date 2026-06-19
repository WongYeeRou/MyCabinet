import { useEffect, useState } from "react";
import { updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "../components/Layout";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setEmail(currentUser.email || "");

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));

    if (userDoc.exists()) {
      setName(userDoc.data().name || "");
    }
  };

  const validatePassword = () => {
    if (!newPassword && !confirmPassword) return true;

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return false;
    }

    if (!/[A-Z]/.test(newPassword)) {
      alert("Password must include at least one uppercase letter.");
      return false;
    }

    if (!/[a-z]/.test(newPassword)) {
      alert("Password must include at least one lowercase letter.");
      return false;
    }

    if (!/[0-9]/.test(newPassword)) {
      alert("Password must include at least one number.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (!name) {
      alert("Username cannot be empty.");
      return;
    }

    if (!validatePassword()) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        name
      });

      if (newPassword) {
        await updatePassword(currentUser, newPassword);
      }

      alert("Profile updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout>
      <h1 style={styles.title}>Profile</h1>
      <p style={styles.subtitle}>View and manage your account information</p>

      <section style={styles.formBox}>
        <h3 style={styles.sectionTitle}>Account Details</h3>

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={styles.label}>Email</label>
        <input style={styles.input} value={email} disabled />

        <label style={styles.label}>New Password</label>
        <div style={styles.passwordRow}>
          <input
            style={styles.passwordInput}
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="button"
            style={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <label style={styles.label}>Confirm Password</label>
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <p style={styles.note}>
          Password must be at least 8 characters and include uppercase,
          lowercase and number.
        </p>

        <button style={styles.btn} onClick={handleSave}>
          Save Changes
        </button>
      </section>
    </Layout>
  );
}

const styles = {
  title: { margin: 0 , fontSize: "30px"},
  subtitle: { marginTop: "5px", color: "#555" },

  formBox: {
    border: "1px solid #999",
    borderRadius: "10px",
    width: "500px",
    padding: "20px",
    marginTop: "25px",
    background: "white"
  },

  sectionTitle: {
    marginTop: 0,
    borderBottom: "1px solid #999",
    paddingBottom: "8px"
  },

  label: {
    display: "block",
    marginTop: "15px",
    marginBottom: "6px"
  },

  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #999",
    borderRadius: "8px",
    boxSizing: "border-box"
  },

  passwordRow: {
    display: "flex",
    alignItems: "center"
  },

  passwordInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #999",
    borderRadius: "8px 0 0 8px",
    boxSizing: "border-box"
  },

  eyeBtn: {
    padding: "10px 12px",
    border: "1px solid #999",
    borderLeft: "none",
    borderRadius: "0 8px 8px 0",
    background: "white",
    cursor: "pointer"
  },

  note: {
    fontSize: "13px",
    color: "#666",
    marginTop: "12px"
  },

  btn: {
    marginTop: "18px",
    padding: "9px 18px",
    border: "1px solid #999",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer"
  }
};

export default Profile;