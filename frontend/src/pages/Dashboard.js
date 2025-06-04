import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [phase, setPhase] = useState("1");
  const [subject, setSubject] = useState("Physics");
  const [data, setData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const name = localStorage.getItem("name");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/chapters/?phase=${phase}&subject=${subject}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [phase, subject]);

  const handleStatusChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    axios.patch(`http://127.0.0.1:8000/api/chapters/${id}/`, {
      status: newStatus,
    });
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <div className="left">
          <img
            src="https://via.placeholder.com/40"
            alt="profile"
            className="profile-pic"
          />
          <span>{name}</span>
        </div>
        <div className="right">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar">
          <button onClick={logout}>Logout</button>
        </div>
      )}

      {/* Dropdowns */}
      <div className="filters">
        <select value={phase} onChange={(e) => setPhase(e.target.value)}>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1}>{i + 1}</option>
          ))}
        </select>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option>Physics</option>
          <option>Chemistry</option>
          <option>Mathematics</option>
        </select>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Chapter</th>
            <th>Status</th>
            <th>Assignment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.sno}</td>
              <td>{row.chapter}</td>
              <td>
                <input
                  type="text"
                  value={row.status}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                />
              </td>
              <td>{row.assignment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
