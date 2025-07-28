import React from 'react';
import './UserEventDetails.css';

const TEXT = {
  en: {
    title: 'Event Details',
    name: 'Event Name:',
    desc: 'Description:',
    start: 'Start Date/Time:',
    end: 'End Date/Time:',
    issue: 'Issue Date:',
    location: 'Location:',
    level: 'Level:',
    type: 'Event Type:',
  },
  hi: {
    title: 'आयोजन विवरण',
    name: 'आयोजन का नाम:',
    desc: 'विवरण:',
    start: 'प्रारंभ तिथि/समय:',
    end: 'समाप्ति तिथि/समय:',
    issue: 'जारी करने की तिथि:',
    location: 'स्थान:',
    level: 'स्तर:',
    type: 'आयोजन का प्रकार:',
  },
};

const UserEventDetails = ({ event, formatDateTime, language = 'hi' }) => {
  const t = TEXT[language] || TEXT.hi;
   const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
  if (!event) return null;
  return (
    <>
    <div className='event-details'>
      <div><h2 className="userpanel-modal-title">{t.title}</h2></div>
      <div><b>{t.name}</b> {event.name}</div>
      <div><b>{t.desc}</b> {event.description}</div>
      <div><b>{t.start}</b> {formatDateTime(event.start_date_time).date} {formatDateTime(event.start_date_time).time}</div>
      <div><b>{t.end}</b> {formatDateTime(event.end_date_time).date} {formatDateTime(event.end_date_time).time}</div>
      <div><b>{t.issue}</b> {formatDateTime(event.issue_date).date}</div>
      <div><b>{t.location}</b> {event.location}</div>
      {/* <div><b>{t.level}</b> {event.level}</div> */}
      <div><b>{t.type}</b> {event.type}</div>
      <div className="event-media-section">
        {/* Photos */}
        {event.photos && (() => {
          let photosArr = [];
          try {
            photosArr = Array.isArray(event.photos)
              ? event.photos
              : JSON.parse(event.photos);
          } catch {
            photosArr = [];
          }
          return photosArr.length > 0 ? (
            <div className="event-photos-row">
              {photosArr.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.startsWith('http') ? photo : `${apiUrl}${photo}`}
                  alt="Photo"
                  className="event-photo-img"
                />
              ))}
            </div>
          ) : null;
        })()}
      
        {event.video && (
          <div className="event-video-wrapper">
            <video
              controls
              src={`${apiUrl}${event.video}`}
              className="event-video"
            />
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default UserEventDetails; 