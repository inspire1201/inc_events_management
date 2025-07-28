import React from 'react';
import './UserDetailModal.css';
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
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const headerImg = "HEADER_IMAGE_URL_OR_BASE64"; // यहाँ अपना header image url/base64 डालें

  // PDF बनाने वाला function
  const handlePrintReport = async () => {
    // UserDetailPdf को server-side render करें
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

    // html2canvas से image बनाएं
    const canvas = await html2canvas(printSection, { scale: 2, useCORS: true, allowTaint: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('UserDetails.pdf');
    document.body.removeChild(printSection);
    // SweetAlert success
    Swal.fire({
      icon: 'success',
      title: 'PDF सफलतापूर्वक जनरेट हो गया!\nPDF generated successfully!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  return (
    <Modal onClose={onClose}>
      <div className="user-detail-modal-root">
        <h3>{t.title}</h3>
        {/* Hidden printable section */}
        <div style={{ display: 'none' }}>
          <UserDetailPdf
            userDetailModal={userDetailModal}
            formatDateTime={formatDateTime}
            t={t}
            API_URL={API_URL}
            headerImg={headerImg}
          />
        </div>
        <div><b>{t.name}</b> {userDetailModal.name}</div>
        <div><b>{t.designation}</b> {userDetailModal.designation}</div>
        {userDetailModal.details && (
          <>
            {/* <div className="user-detail-section"><b>{t.details}</b></div> */}
            <div><b>{t.eventName}</b> {userDetailModal.details.name}</div>
            <div><b>{t.desc}</b> {userDetailModal.details.description}</div>
            <div><b>{t.start}</b> {formatDateTime(userDetailModal.details.start_date_time).date} {formatDateTime(userDetailModal.details.start_date_time).time}</div>
            <div><b>{t.end}</b> {formatDateTime(userDetailModal.details.end_date_time).date} {formatDateTime(userDetailModal.details.end_date_time).time}</div>
            <div><b>{t.issue}</b> {formatDateTime(userDetailModal.details.issue_date).date}</div>
            <div><b>{t.location}</b> {userDetailModal.details.location}</div>
            <div><b>{t.attendees}</b> {userDetailModal.details.attendees}</div>
            <div><b>{t.updateDate}</b> {formatDateTime(userDetailModal.details.update_date).date}</div>
            <div><b>{t.type}</b> {userDetailModal.details.type}</div>
            {userDetailModal.details.photos && (() => {
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
                  <b>{t.photos}</b>
                  <div className="user-detail-photos">
                    {photosArr.map((photo, idx) => (
                      <img key={idx} src={photo.startsWith('http') ? photo : `${API_URL}${photo}`} alt="Photo" />
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
            {userDetailModal.details.video && (
              <div>
                <b>{t.video}</b>
                <video
                  controls
                  src={
                    userDetailModal.details.video && userDetailModal.details.video.startsWith('http')
                      ? userDetailModal.details.video
                      : `${API_URL}${userDetailModal.details.video}`
                  }
                  className="user-detail-video"
                />
              </div>
            )}
            {userDetailModal.details.media_photos && (
              <div>
                <b>{t.mediaPhotos}</b>
                <div className="user-detail-photos">
                  {JSON.parse(userDetailModal.details.media_photos).map((photo, idx) => (
                    <img key={idx} src={photo.startsWith('http') ? photo : `${API_URL}${photo}`} alt="Media Photo" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div className="user-detail-actions">
          <button 
            style={{background:'green'}} 
            onClick={handlePrintReport}
          >{t.print}</button>
          <button 
          style={{background:'blue'}} 
          onClick={() => alert('डेटा स्वीकार किया गया!')}>{t.accept}</button>
          <button 
          style={{background:'red'}} 
          onClick={onClose}>{t.close}</button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;
