import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp()
      });

      alert("Account created successfully");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.logo}></div>
        <h2>My Cabinet</h2>

        <div style={styles.intro}>
          <p>Create an account to manage your BJD collections and preorder records.</p>
        </div>
      </div>

      <div style={styles.right}>
        <h1>Register</h1>

        <input type="text" placeholder="Name" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Create Password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" style={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <button style={styles.button} onClick={handleRegister}>
          Create Account
        </button>

        <Link to="/">Login here</Link>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "100vh", justifyContent: "center", alignItems: "center", gap: "100px" },
  left: { width: "250px" },
  right: { width: "350px", display: "flex", flexDirection: "column", gap: "15px" },
  logo: { width: "120px", height: "120px", border: "1px solid black", marginBottom: "20px" },
  intro: { border: "1px solid black", padding: "15px", marginTop: "20px" },
  input: { padding: "12px", fontSize: "16px" },
  button: { padding: "12px", cursor: "pointer" }
};

export default Register;
