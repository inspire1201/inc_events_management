import React from 'react';
import Modal from './Modal';
import UserDetailPdf from './UserDetailPdf';
import ReactDOMServer from 'react-dom/server';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

const TEXT = {
  en: {
    title: 'User Details',
    name: 'Name:',
    designation: 'Designation:',
    details: 'Details:',
    eventName: 'Event Name:',
    desc: 'Description:',
    start: 'Start Date/Time:',
    end: 'End Date/Time:',
    issue: 'Issue Date:',
    location: 'Location:',
    attendees: 'Number of Attendees:',
    updateDate: 'Update Date:',
    type: 'Event Type:',
    photos: 'Photos:',
    video: 'Video:',
    mediaPhotos: 'Media Coverage Photos:',
    print: 'Print Report',
    accept: 'Accept Data',
    close: 'Close',
  },
  hi: {
    title: 'उपयोगकर्ता विवरण',
    name: 'नाम:',
    designation: 'पदनाम:',
    details: 'विवरण:',
    eventName: 'आयोजन का नाम:',
    desc: 'विवरण:',
    start: 'प्रारंभ तिथि/समय:',
    end: 'समाप्ति तिथि/समय:',
    issue: 'जारी करने की तिथि:',
    location: 'स्थान:',
    attendees: 'उपस्थित लोगों की संख्या:',
    updateDate: 'अपडेट की तिथि:',
    type: 'आयोजन का प्रकार:',
    photos: 'फोटो:',
    video: 'वीडियो:',
    mediaPhotos: 'मीडिया कवरेज फोटो:',
    print: 'रिपोर्ट प्रिंट करें',
    accept: 'डेटा स्वीकार करें',
    close: 'बंद करें',
  },
};

const UserDetailModal = ({ userDetailModal, onClose, formatDateTime, language = 'hi' }) => {
  const t = TEXT[language] || TEXT.hi;
  const API_URL = import.meta.env.VITE_API_URL;

  const handlePrintReport = async () => {
    const pdfHtml = ReactDOMServer.renderToString(
      <UserDetailPdf
        userDetailModal={userDetailModal}
        formatDateTime={formatDateTime}
        t={t}
        API_URL={API_URL}
        headerImg={headerImg}
      />
    );

    const printSection = document.createElement('div');
    printSection.innerHTML = pdfHtml;
    document.body.appendChild(printSection);

    const canvas = await html2canvas(printSection, { scale: 2, useCORS: true, allowTaint: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('UserDetails.pdf');
    document.body.removeChild(printSection);

    Swal.fire({
      icon: 'success',
      title: 'PDF सफलतापूर्वक जनरेट हो गया!\nPDF generated successfully!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  return (
    <Modal onClose={onClose}>
      <div className="max-w-[650px] mx-auto p-8 sm:p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-3">
        <h3 className="text-2xl sm:text-xl font-bold text-center text-gray-800 pb-3 border-b-2 border-gray-200 relative">
          {t.title}
          <span className="absolute bottom-[-2px] left-1/2 transform -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600"></span>
        </h3>

        <div className="text-sm sm:text-xs text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.name}</b>{userDetailModal.name}</div>
        <div className="text-sm sm:text-xs text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.designation}</b>{userDetailModal.designation}</div>

        {userDetailModal.details && (
          <>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.eventName}</b>{userDetailModal.details.name}</div>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.desc}</b>{userDetailModal.details.description}</div>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.start}</b>{formatDateTime(userDetailModal.details.start_date_time).date} {formatDateTime(userDetailModal.details.start_date_time).time}</div>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.end}</b>{formatDateTime(userDetailModal.details.end_date_time).date} {formatDateTime(userDetailModal.details.end_date_time).time}</div>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.issue}</b>{formatDateTime(userDetailModal.details.issue_date).date}</div>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.location}</b>{userDetailModal.details.location}</div>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.attendees}</b>{userDetailModal.details.attendees}</div>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.updateDate}</b>{formatDateTime(userDetailModal.details.update_date).date}</div>
            <div className="text-sm text-gray-800 flex flex-wrap items-center gap-1"><b className="text-purple-700 font-bold mr-1">{t.type}</b>{userDetailModal.details.type}</div>

            {/* Photos */}
            {(() => {
              let photosArr = [];
              try {
                photosArr = Array.isArray(userDetailModal.details.photos)
                  ? userDetailModal.details.photos
                  : JSON.parse(userDetailModal.details.photos);
              } catch {
                photosArr = [];
              }
              return photosArr.length > 0 ? (
                <div>
                  <b className="text-purple-700 font-bold">{t.photos}</b>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {photosArr.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo.startsWith('http') ? photo : `${API_URL}${photo}`}
                        alt="Photo"
                        className="w-28 h-20 sm:w-24 sm:h-16 object-cover rounded-md border-2 border-gray-200 shadow-md hover:border-indigo-500 transform hover:scale-105 transition-all"
                      />
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Video */}
            {userDetailModal.details.video && (
              <div>
                <b className="text-purple-700 font-bold">{t.video}</b>
                <video
                  controls
                  src={
                    userDetailModal.details.video.startsWith('http')
                      ? userDetailModal.details.video
                      : `${API_URL}${userDetailModal.details.video}`
                  }
                  className="block mx-auto my-4 w-[360px] max-w-full h-[220px] rounded-xl border-4 border-purple-700 shadow-lg object-cover"
                />
              </div>
            )}

            {/* Media Photos */}
            {userDetailModal.details.media_photos && (
              <div>
                <b className="text-purple-700 font-bold">{t.mediaPhotos}</b>
                <div className="flex flex-wrap gap-3 mt-2">
                  {JSON.parse(userDetailModal.details.media_photos).map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo.startsWith('http') ? photo : `${API_URL}${photo}`}
                      alt="Media Photo"
                      className="w-28 h-20 sm:w-24 sm:h-16 object-cover rounded-md border-2 border-gray-200 shadow-md hover:border-indigo-500 transform hover:scale-105 transition-all"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <button
            className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-gradient-to-r from-purple-700 to-indigo-500 transform hover:scale-105 transition-all"
            onClick={handlePrintReport}
          >
            {t.print}
          </button>
          <button
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-gradient-to-r from-purple-700 to-indigo-500 transform hover:scale-105 transition-all"
            onClick={() => alert('डेटा स्वीकार किया गया!')}
          >
            {t.accept}
          </button>
          <button
            className="bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-gradient-to-r from-purple-700 to-indigo-500 transform hover:scale-105 transition-all"
            onClick={onClose}
          >
            {t.close}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;
