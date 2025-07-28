import React, { useState } from 'react';
import './UserEventUpdateForm.css';
import Swal from 'sweetalert2';

const TEXT = {
  en: {
    title: 'Update Event',
    name: 'Event Name:',
    desc: 'Description:',
    start: 'Start Date/Time:',
    end: 'End Date/Time:',
    issue: 'Issue Date:',
    location: 'Location:',
    attendees: 'Number of Attendees:',
    type: 'Event Type:',
    photos: 'Photos (max 10):',
    video: 'Video (max 10 MB):',
    mediaPhotos: 'Media Coverage Photos (max 5):',  
    updateBtn: 'Update',
  },
  hi: {
    title: 'आयोजन अपडेट करें',
    name: 'आयोजन का नाम:',
    desc: 'विवरण:',
    start: 'प्रारंभ तिथि/समय:',
    end: 'समाप्ति तिथि/समय:',
    issue: 'जारी करने की तिथि:',
    location: 'स्थान:',
    attendees: 'उपस्थित लोगों की संख्या:',
    type: 'आयोजन का प्रकार:',
    photos: 'फोटो (अधिकतम 10):',
    video: 'वीडियो (न्यूनतम 10 MB):',
    mediaPhotos: 'मीडिया कवरेज फोटो (अधिकतम 5):',
    updateBtn: 'अपडेट करें',
  },
};

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const UserEventUpdateForm = ({ updateForm, handleFormChange, handleFileChange, handleUpdateSubmit, eventTypes, language = 'hi' }) => {
  const t = TEXT[language] || TEXT.hi;
  const [localForm, setLocalForm] = useState(updateForm);
  const [localMedia, setLocalMedia] = useState({
    photos: updateForm?.photos || [],
    video: updateForm?.video || [],
    media_photos: updateForm?.media_photos || [],
  });

  React.useEffect(() => {
    setLocalForm(updateForm);
    setLocalMedia({
      photos: updateForm?.photos || [],
      video: updateForm?.video || [],
      media_photos: updateForm?.media_photos || [],
    });
  }, [updateForm && updateForm.id]); // Only reset when event id changes

  // Custom file change handler for SweetAlert
  const customHandleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'photos' && files.length > 10) {
      Swal.fire({
        icon: 'warning',
        title: 'अधिकतम 10 फोटो ही चुन सकते हैं! (Max 10 images allowed)',
        text: 'आप एक बार में 10 से ज्यादा फोटो अपलोड नहीं कर सकते।',
      });
      e.target.value = '';
      return;
    }
    if (name === 'media_photos' && files.length > 5) {
      Swal.fire({
        icon: 'warning',
        title: 'अधिकतम 5 मीडिया फोटो ही चुन सकते हैं! (Max 5 media images allowed)',
        text: 'आप एक बार में 5 से ज्यादा मीडिया फोटो अपलोड नहीं कर सकते।',
      });
      e.target.value = '';
      return;
    }
    // Update local media state for preview
    setLocalMedia((prev) => ({ ...prev, [name]: files }));
    handleFileChange(e);
  };

  const handleLocalFormChange = (e) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({ ...prev, [name]: value }));
    handleFormChange(e);
  };

  const onUpdateSubmit = (e) => {
    e.preventDefault();
    handleUpdateSubmit(e);
  };

  // Remove media handler
  const handleRemoveMedia = (type, idx) => {
    setLocalMedia(prev => {
      const arr = Array.from(prev[type]);
      arr.splice(idx, 1);
      return { ...prev, [type]: arr };
    });
    // Optionally, update parent state if needed
  };

  const videoArr = Array.isArray(localMedia.video) ? localMedia.video : localMedia.video ? [localMedia.video] : [];

  return (
    <form className="userpanel-form" onSubmit={onUpdateSubmit}>
      <h2 className="userpanel-modal-title">{t.title}</h2>
      {/* Edit button in read-only mode */}
      {/* Remove the Edit button, always allow editing and show only Update button */}
      <div className="userpanel-form-group">
        <label>{t.name} <input  className="readonly-box" name="name" value={localForm.name} readOnly /></label>
      </div>
      {/* Event Details Group Start */}
      <div className="event-details-group">
        <div className="userpanel-form-group">
          <label className="event-details-label">{t.desc}</label>
          <textarea className="event-details-textarea" readOnly value={localForm.description || ''} />
        </div>
        <div className="userpanel-form-group">
          <label className="event-details-label">{t.start}</label>
          <div className="event-details-readonly">{formatDateTime(localForm.start_date_time)}</div>
        </div>
        <div className="userpanel-form-group">
          <label className="event-details-label">{t.end}</label>
          <div className="event-details-readonly">{formatDateTime(localForm.end_date_time)}</div>
        </div>
        <div className="userpanel-form-group">
          <label className="event-details-label">{t.issue}</label>
          <div className="event-details-readonly">{formatDateTime(localForm.issue_date)}</div>
        </div>
      </div>
      {/* Event Details Group End */}
      <div className="userpanel-form-group">
        <label>{t.location} <input className="readonly-box" name="location" value={localForm.location} readOnly/></label>
      </div>
      <div className="userpanel-form-group">
        <label>{t.attendees} <input type="number" name="attendees" value={localForm.attendees} onChange={handleLocalFormChange} required /></label>
      </div>
      <div className="userpanel-form-group">
        <label>{t.type} 
          <select name="type" value={localForm.type} onChange={handleLocalFormChange} required>
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="userpanel-form-group">
        <label>{t.photos} <input type="file" name="photos" multiple accept="image/*" onChange={customHandleFileChange} /></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {localMedia.photos && Array.from(localMedia.photos).length > 0 && Array.from(localMedia.photos).map((file, idx) => (
          <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemoveMedia('photos', idx)}
              style={{ position: 'absolute', top: 2, right: 2, zIndex: 2, background: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '2px 6px' }}
            >❌</button>
            {(file instanceof File)
              ? <img src={URL.createObjectURL(file)} alt="Preview" className="userpanel-img-preview" />
              : typeof file === 'string'
                ? <img src={file} alt="Preview" className="userpanel-img-preview" />
                : null}
          </div>
        ))}
        </div>
      </div>
      <div className="userpanel-form-group">
        <label>{t.video} <input type="file" name="video" accept="video/*" onChange={customHandleFileChange} /></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {videoArr.length > 0 && videoArr.map((file, idx) => (
          <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemoveMedia('video', idx)}
              style={{ position: 'absolute', top: 2, right: 2, zIndex: 2, background: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '2px 6px' }}
            >❌</button>
            {file instanceof File
              ? <video controls src={URL.createObjectURL(file)} className="userpanel-video-preview" />
              : typeof file === 'string'
                ? <video controls src={file} className="userpanel-video-preview" />
                : null}
          </div>
        ))}
        </div>
      </div>
      <div className="userpanel-form-group">
        <label>{t.mediaPhotos} <input type="file" name="media_photos" multiple accept="image/*" onChange={customHandleFileChange} /></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {localMedia.media_photos && Array.from(localMedia.media_photos).length > 0 && Array.from(localMedia.media_photos).map((file, idx) => (
          <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemoveMedia('media_photos', idx)}
              style={{ position: 'absolute', top: 2, right: 2, zIndex: 2, background: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '2px 6px' }}
            >❌</button>
            {(file instanceof File)
              ? <img src={URL.createObjectURL(file)} alt="Preview" className="userpanel-img-preview" />
              : typeof file === 'string'
                ? <img src={file} alt="Preview" className="userpanel-img-preview" />
                : null}
          </div>
        ))}
        </div>
      </div>
      <button type="submit" className="userpanel-btn userpanel-btn-submit">{t.updateBtn}</button>
    </form>
  );
};

export default UserEventUpdateForm; 