import React from 'react';

const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-[1000]"
    onClick={onClose}
  >
    <div
      className="bg-white p-8 pt-8 rounded-2xl w-[90vw] min-w-[320px] max-w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.18),_0_1.5px_6px_rgba(0,0,0,0.10)] relative transition-shadow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-red-600 transition-colors z-10 p-2"
        onClick={onClose}
        aria-label="Close Modal"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
