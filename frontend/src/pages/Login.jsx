import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from '../services/api';
import axios from "axios";
import '../index.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Log in or register
      if (!isLogin) {
        await register(formData);
      }

      const loginResponse = await login({
        username: formData.username,
        password: formData.password
      });

      const { access, user } = loginResponse;

      // Save to localStorage
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));

      // Fetch pfp
      const pfpRes = await axios.get("http://127.0.0.1:8000/api/users/preferences/", {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });

      const pfp = pfpRes.data.profile_picture || "pfp.png";
      localStorage.setItem("pfp", pfp);

      navigate("/dashboard");

    } catch (err) {
      setError(err.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-graphic">
        <pre className="ascii-bunny">
          {`
|￣￣￣￣￣￣￣￣￣￣￣￣|
|      WELCOME!      |
|＿＿＿＿＿＿＿＿＿＿＿＿|
(\\__/) ||
(•ㅅ•) ||
/ づ
`}
        </pre>
      </div>
      <h2>{isLogin ? "LOGIN" : "REGISTER"}</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        {!isLogin && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              required
              value={formData.first_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              required
              value={formData.last_name}
              onChange={handleChange}
            />
          </>
        )}
        <button type="submit">{isLogin ? "Log In" : "Register"}</button>
      </form>
      <button
        className="toggle-form"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}

export default Login;
