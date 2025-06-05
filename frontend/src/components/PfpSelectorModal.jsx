import React from "react";
import "./PfpSelectorModal.css";

import pfp from "../assets/pfp.png";
import bowtie from "../assets/pfp-bowtie.png";
import bow1 from "../assets/pfp-bow1.png";
import bow2 from "../assets/pfp-bow2.png";
import tophat from "../assets/pfp-tophat.png";
import partyhat from "../assets/pfp-partyhat.png";

const allPfps = [
    { name: "pfp.png", img: pfp },
    { name: "pfp-bowtie.png", img: bowtie },
    { name: "pfp-bow1.png", img: bow1 },
    { name: "pfp-bow2.png", img: bow2 },
    { name: "pfp-tophat.png", img: tophat },
    { name: "pfp-partyhat.png", img: partyhat },
];

export default function PfpSelectorModal({ show, onClose, onSelect }) {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>Select a Profile Picture!</h3>
                <center>
        <div className="pfp-grid">
                    {allPfps.map((pfpItem) => (
                        <img
                            key={pfpItem.name}
                            src={pfpItem.img}
                            alt={pfpItem.name}
                            className="pfp-option"
                            onClick={() => {
                                onSelect(pfpItem.name);
                                onClose();
                            }}
                        />
                    ))}
                </div>
                </center>
                
                <button className="close-button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}