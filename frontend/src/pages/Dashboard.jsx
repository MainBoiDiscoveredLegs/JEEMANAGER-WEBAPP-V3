import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import KeyModal from "../components/KeyModal";
import pfp from "../assets/pfp.png";

function Dashboard() {
    const [phase, setPhase] = useState("1");
    const [subject, setSubject] = useState("Physics");
    const [data, setData] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [showKey, setShowKey] = useState(false);

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
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="header">
                    <div className="left">
                        <img src={pfp} alt="profile" className="profile-pic" />
                        <span>{name}</span>
                    </div>
                    <div className={`hamburger-wrapper ${sidebarOpen ? "shifted" : ""}`}>
                        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                    </div>
                </div>

                <div className="filters">
                    <select value={phase} onChange={(e) => setPhase(e.target.value)}>
                        {[...Array(13)].map((_, i) => (
                            <option key={i + 1}>{i + 1}</option>
                        ))}
                    </select>

                    <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Mathematics</option>
                    </select>
                </div>

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
                                    <textarea
                                        rows={2}
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

            <div className={`sidebar right-sidebar ${sidebarOpen ? "" : "hidden"}`}>
                <div className="sidebar-content">
                    <div className="sidebar-options">
                        <button onClick={() => setShowKey(true)}>Key</button>
                    </div>
                    <div style={{ flexGrow: 1 }}></div>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
            <KeyModal show={showKey} onClose={() => setShowKey(false)} />
        </div>

    );
}

export default Dashboard;