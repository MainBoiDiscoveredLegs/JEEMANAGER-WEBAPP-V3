import React, { useState } from "react";
import "./KeyModal.css";

function KeyModal({ show, onClose }) {
  const [openSubjects, setOpenSubjects] = useState({
    Mathematics: true,
    Chemistry: true,
    Physics: true,
  });

  const [openPhases, setOpenPhases] = useState({
    Mathematics: { 2: true },
    Chemistry: { 1: true },
    Physics: { 1: true, 2: true },
  });

  const toggleSubject = (subject) => {
    setOpenSubjects((prev) => ({ ...prev, [subject]: !prev[subject] }));
  };

  const togglePhase = (subject, phase) => {
    setOpenPhases((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [phase]: !prev[subject]?.[phase],
      },
    }));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Chapter Key</h2>

        {["Mathematics", "Chemistry", "Physics"].map((subject) => (
          <div className="subject-section" key={subject}>
            <h3 onClick={() => toggleSubject(subject)} className="clickable">
              {openSubjects[subject] ? "▾" : "▸"}{" "}
              {subject}
            </h3>
            {openSubjects[subject] && (
              <div className="phases">
                {Object.entries({
                  Mathematics: {
                    2: ["Quadratic Equations"],
                  },
                  Chemistry: {
                    1: ["Atomic Structure"],
                  },
                  Physics: {
                    1: ["Kinematics", "Vectors"],
                    2: ["Laws of Motion"],
                  },
                }[subject]).map(([phase, chapters]) => (
                  <div className="phase-block" key={phase}>
                    <div
                      className="phase-bracket clickable"
                      onClick={() => togglePhase(subject, phase)}
                    >
                      {openPhases[subject]?.[phase] ? "▾" : "▸"} Phase {phase}
                    </div>
                    {openPhases[subject]?.[phase] && (
                      <ul>
                        {chapters.map((chapter, idx) => (
                          <li key={idx}>{chapter}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default KeyModal;
