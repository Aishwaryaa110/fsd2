import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username.trim() === "" || password === "") {
      alert("Please enter username and password");
      return;
    }

    // Remove spaces and make username lowercase
    const enteredUsername = username.trim().toLowerCase();

    let role = "";

    // Check login credentials
    if (enteredUsername === "admin" && password === "123") {
      role = "admin";
    } else if (enteredUsername === "editor" && password === "123") {
      role = "editor";
    } else if (enteredUsername === "viewer" && password === "123") {
      role = "viewer";
    } else {
      alert("Invalid Username or Password");
      return;
    }

    // Store authentication information
    localStorage.setItem("token", "jwt_token_123456");
    localStorage.setItem("username", enteredUsername);
    localStorage.setItem("role", role);

    // Go to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <div className="login-card">

        <div className="logo">🔐</div>

        <h1 className="title">
          JWT Authentication
        </h1>

        <p className="subtitle">
          Secure Role Based Login
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <div className="credentials">
          <p>Admin / 123</p>
          <p>Editor / 123</p>
          <p>Viewer / 123</p>
        </div>

      </div>
    </div>
  );
}

export default Login;