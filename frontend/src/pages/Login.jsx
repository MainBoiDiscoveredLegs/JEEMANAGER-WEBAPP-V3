
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../index.css';

function Login() {
  const [name, setName] = useState("");
  const [admission, setAdmission] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage for nowwww
    localStorage.setItem("name", name);
    localStorage.setItem("admission", admission);
    navigate("/dashboard");
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
      <h2>LOGIN</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required
          value={name}
          onChange={(e) => setName(e.target.value)} />
        <input type="password" placeholder="Admission Number" required
          value={admission}
          onChange={(e) => setAdmission(e.target.value)} />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;