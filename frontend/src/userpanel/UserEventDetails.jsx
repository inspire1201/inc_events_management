import React, { useState } from 'react';
import './UserEventDetails.css';
import { useLanguage } from '../context/LanguageContext';

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

const UserEventDetails = ({ event, formatDateTime, onClose }) => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.hi;
  const apiUrl = import.meta.env.VITE_API_URL;
  const [previewImg, setPreviewImg] = useState(null);

  if (!event) return null;

  const handleImageClick = (src) => {
    setPreviewImg(src.startsWith('http') ? src : `${apiUrl}${src}`);
  };

  const closePreview = () => setPreviewImg(null);

  return (
    <>
      <div className='event-details'>
        <div onClick={onClose} className="flex justify-end">
          <span className="text-4xl cursor-pointer">&times;</span>
        </div>
        <div><h2 className="userpanel-modal-title">{t.title}</h2></div>
        <div><b>{t.name}</b> {event.name}</div>
        <div><b>{t.desc}</b> {event.description}</div>
        <div><b>{t.start}</b> {formatDateTime(event.start_date_time).date} {formatDateTime(event.start_date_time).time}</div>
        <div><b>{t.end}</b> {formatDateTime(event.end_date_time).date} {formatDateTime(event.end_date_time).time}</div>
        <div><b>{t.issue}</b> {formatDateTime(event.issue_date).date}</div>
        <div><b>{t.location}</b> {event.location}</div>
        <div><b>{t.type}</b> {event.type}</div>

        <div className="space-y-6 p-4">
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
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {photosArr.map((photo, idx) => {
                  const src = photo.startsWith('http') ? photo : `${apiUrl}${photo}`;
                  return (
                    <img
                      key={idx}
                      src={src}
                      alt="Photo"
                      className="w-full h-48 object-cover rounded-md shadow-sm cursor-pointer"
                      onClick={() => handleImageClick(photo)}
                    />
                  );
                })}
              </div>
            ) : null;
          })()}

          {/* Video */}
          {event.video && (
            <div className="w-full max-w-4xl mx-auto">
              <video
                controls
                src={`${apiUrl}${event.video}`}
                className="w-full h-auto rounded-md shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <span
            className="absolute top-4 right-6 text-white text-4xl cursor-pointer"
            onClick={closePreview}
          >
            &times;
          </span>
          <img
            src={previewImg}
            alt="Preview"
            className="max-h-full max-w-full object-contain rounded-md shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default UserEventDetails;
