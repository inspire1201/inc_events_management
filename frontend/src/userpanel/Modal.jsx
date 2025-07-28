import React from 'react';
import './Modal.css';

const Modal = ({ children, onClose }) => (
  <div className="userpanel-modal-overlay">
    <div className="userpanel-modal-content">
      <div className="userpanel-modal-scrollable">
        <button className="userpanel-modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  </div>
);

export default Modal; 