import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
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
          <p>
            Manage your BJD preorder records, payment reminders,
            collections and spending in one place.
          </p>
        </div>
      </div>

      <div style={styles.right}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    gap: "100px"
  },

  left: {
    width: "250px"
  },

  right: {
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  logo: {
    width: "120px",
    height: "120px",
    border: "1px solid black",
    marginBottom: "20px"
  },

  intro: {
    border: "1px solid black",
    padding: "15px",
    marginTop: "20px"
  },

  input: {
    padding: "12px",
    fontSize: "16px"
  },

  button: {
    padding: "12px",
    cursor: "pointer"
  }
};

export default Login;