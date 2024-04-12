import React, { useState } from "react";

const InviteMembersModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className={`modal ${open ? "open" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="tabs">
          <button className={`tab-link ${activeTab === 1 ? "active" : ""}`} onClick={() => handleTabChange(1)}>Invite via Email</button>
          <button className={`tab-link ${activeTab === 2 ? "active" : ""}`} onClick={() => handleTabChange(2)}>Invite via Link</button>
        </div>
        <div className="tab-content">
          {activeTab === 1 && (
            <div className="email-invite">
              <textarea placeholder="name@company.com, name@company.com, ..." />
              <button className="btn">Invite</button>
            </div>
          )}
          {activeTab === 2 && (
            <div className="link-invite">
              <p>Create an invite link and send it to your teammates.</p>
              <button className="btn">Create an Invite Link</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteMembersModal;
