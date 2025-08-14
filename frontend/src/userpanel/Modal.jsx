import React from 'react';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[1000] p-2 sm:p-4">
    <div className="bg-white p-0 rounded-lg w-full h-full sm:w-full sm:h-full md:w-full md:h-full lg:w-full lg:h-full xl:w-full xl:h-full relative shadow-[0_2px_16px_rgba(0,0,0,0.15)] max-w-none">
      <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-lg relative">
        {children}
      </div>
    </div>
  </div>
);

export default Modal;
