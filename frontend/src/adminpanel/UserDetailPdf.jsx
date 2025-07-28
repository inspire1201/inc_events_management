import React from 'react';
import './UserDetailPdf.css';

const UserDetailPdf = ({ userDetailModal, formatDateTime, t, API_URL, headerImg }) => {
  let photosArr = [];
  try {
    photosArr = Array.isArray(userDetailModal.details?.photos)
      ? userDetailModal.details.photos
      : JSON.parse(userDetailModal.details?.photos || '[]');
  } catch { photosArr = []; }

  let mediaPhotosArr = [];
  try {
    mediaPhotosArr = Array.isArray(userDetailModal.details?.media_photos)
      ? userDetailModal.details.media_photos
      : JSON.parse(userDetailModal.details?.media_photos || '[]');
  } catch { mediaPhotosArr = []; }

  return (
    <div id="pdf-content">
      <div className="pdf-header-mpcc">
        <div className="pdf-header-topbar" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', width:'100%'}}>
          <div className="pdf-header-topbar-left" style={{textAlign:'left'}}>
            <div className="pdf-header-label pdf-header-blue">ई-मेल: 'कांग्रेस'</div>
            <div className="pdf-header-label">E-mail: orgmpcct1@gmail.com</div>
            <div className="pdf-header-label">www.mpcongress.org</div>
          </div>
          <div>  <img src={headerImg} alt="Logo" className="pdf-header-logo-main" style={{display:'block', margin:'0 auto', maxWidth:'48px'}} /></div>
          <div className="pdf-header-topbar-right" style={{textAlign:'right'}}>
            <div className="pdf-header-label pdf-header-blue">कार्यालय = 0755-2551512</div>
            <div className="pdf-header-label">0755-2555452</div>
            <div className="pdf-header-label">फैक्स = 0755-2577981</div>
          </div>
        </div>
        <div className="pdf-header-row pdf-header-center" style={{justifyContent:'center', alignItems:'center', flexDirection:'column', marginTop:'2px'}}>
          <div className="pdf-header-title-col" style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop:'6px'}}>
            <div className="pdf-header-title pdf-hindi-text">मध्यप्रदेश कांग्रेस कमेटी</div>
            <div className="pdf-header-address pdf-hindi-text">इंदिरा भवन, शिवाजी नगर, भोपाल-462 016 (म.प्र.)</div>
          </div>
        </div>
      </div>
      <hr className="pdf-header-divider" />
      <div className="pdf-section">
        <b>{t.name}</b> {userDetailModal.name}<br />
        <b>{t.designation}</b> {userDetailModal.designation}<br />
        <b>{t.eventName}</b> {userDetailModal.details?.name || ''}<br />
        <b>{t.desc}</b> {userDetailModal.details?.description || ''}<br />
        <b>{t.start}</b> {formatDateTime(userDetailModal.details?.start_date_time).date} {formatDateTime(userDetailModal.details?.start_date_time).time}<br />
        <b>{t.end}</b> {formatDateTime(userDetailModal.details?.end_date_time).date} {formatDateTime(userDetailModal.details?.end_date_time).time}<br />
        <b>{t.issue}</b> {formatDateTime(userDetailModal.details?.issue_date).date}<br />
        <b>{t.location}</b> {userDetailModal.details?.location || ''}<br />
        <b>{t.attendees}</b> {userDetailModal.details?.attendees || ''}<br />
        <b>{t.updateDate}</b> {formatDateTime(userDetailModal.details?.update_date).date}<br />
        <b>{t.type}</b> {userDetailModal.details?.type || ''}<br />
      </div>
      {photosArr.length > 0 && (
        <div className="pdf-photos-section">
          <b>{t.photos}</b><br />
          <div className="pdf-photo-grid">
            {photosArr.map((photo, idx) => (
              <img
                key={idx}
                src={photo.startsWith('http') ? photo : `${API_URL}${photo}`}
                alt="Photo"
                className="pdf-photo"
                crossOrigin="anonymous"
              />
            ))}
          </div>
        </div>
      )}
      {mediaPhotosArr.length > 0 && (
        <div className="pdf-media-photos-section">
          <b>{t.mediaPhotos}</b><br />
          <div className="pdf-media-photo-grid">
            {mediaPhotosArr.map((photo, idx) => (
              <img
                key={idx}
                src={photo.startsWith('http') ? photo : `${API_URL}${photo}`}
                alt="Media Photo"
                className="pdf-media-photo"
                crossOrigin="anonymous"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPdf; 