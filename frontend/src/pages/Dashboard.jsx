import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import KeyModal from "../components/KeyModal";
import PfpSelectorModal from "../components/PfpSelectorModal";

function Dashboard() {
    const [phase, setPhase] = useState("1");
    const [subject, setSubject] = useState("Physics");
    const [data, setData] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [showKey, setShowKey] = useState(false);

    const [showPfpModal, setShowPfpModal] = useState(false);
    const [currentPfp, setCurrentPfp] = useState(localStorage.getItem("pfp") || "pfp.png");

    const [rowHighlights, setRowHighlights] = useState({});

    const name = localStorage.getItem("name");

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/chapters/?phase=${phase}&subject=${subject}`)
            .then((res) => setData(res.data))
            .catch((err) => console.error(err));
    }, [phase, subject]);

    useEffect(() => {
        const key = `rowHighlights-${subject}-${phase}`;
        const savedHighlights = localStorage.getItem(key);
        if (savedHighlights) {
            setRowHighlights(JSON.parse(savedHighlights));
        } else {
            setRowHighlights({});
        }
    }, [subject, phase]);

    useEffect(() => {
        const key = `rowHighlights-${subject}-${phase}`;
        localStorage.setItem(key, JSON.stringify(rowHighlights));
    }, [rowHighlights, subject, phase]);

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

    const images = import.meta.glob("../assets/pfp*.png", { eager: true });

    return (
        <div className="dashboard">
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="header">
                    <div className="left">
                        <img
                            src={images[`../assets/${currentPfp}`]?.default}
                            alt="profile"
                            className="profile-pic"
                            onClick={() => setShowPfpModal(true)}
                            style={{ cursor: "pointer" }}
                        />
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
                            <th></th>
                            <th>S.No</th>
                            <th>Chapter</th>
                            <th>Status</th>
                            <th>Assignment</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row) => (
                            <tr
                                key={row.id}
                                style={{ backgroundColor: rowHighlights[row.id] || "transparent" }}
                            >
                                <td>
                                    <div style={{ display: "flex", gap: "5px" }}>
                                        {["#ade1ec", "#baadec", "#cbecad"].map((color) => (
                                            <span
                                                key={color}
                                                onClick={() =>
                                                    setRowHighlights((prev) => {
                                                        const newHighlights = { ...prev };
                                                        if (newHighlights[row.id] === color) {
                                                            delete newHighlights[row.id];
                                                        } else {
                                                            newHighlights[row.id] = color;
                                                        }
                                                        return newHighlights;
                                                    })
                                                }

                                                style={{
                                                    width: "20px",
                                                    height: "14px",
                                                    borderRadius: "30%",
                                                    backgroundColor: color,
                                                    cursor: "pointer",
                                                }}
                                            ></span>
                                        ))}
                                    </div>
                                </td>
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
            <PfpSelectorModal
                show={showPfpModal}
                onClose={() => setShowPfpModal(false)}
                onSelect={(newPfp) => {
                    localStorage.setItem("pfp", newPfp);
                    setCurrentPfp(newPfp);
                }}
            />
        </div>
    );
}

export default Dashboard;
