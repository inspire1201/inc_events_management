import React from 'react';
import logo from '../assets/hand_congress.png'

const UserDetailPdf = ({ userDetailModal, formatDateTime, t, API_URL }) => {
  let photosArr = [];
  try {
    photosArr = Array.isArray(userDetailModal.details?.photos)
      ? userDetailModal.details.photos
      : JSON.parse(userDetailModal.details?.photos || '[]');
  } catch {
    photosArr = [];
  }

  let mediaPhotosArr = [];
  try {
    mediaPhotosArr = Array.isArray(userDetailModal.details?.media_photos)
      ? userDetailModal.details.media_photos
      : JSON.parse(userDetailModal.details?.media_photos || '[]');
  } catch {
    mediaPhotosArr = [];
  }

  return (
    <div className="max-w-[800px] mx-auto bg-white text-gray-900 rounded-xl shadow-lg p-8 my-8 font-sans">
      {/* Header */}
      <div className="mb-2 bg-white pt-2 rounded-t-xl">
        {/* Topbar */}
        <div className="flex justify-between items-start w-full text-sm">
          <div className="text-left space-y-1">
            <div className="text-blue-900 font-bold">ई-मेल: 'कांग्रेस'</div>
            <div>E-mail: orgmpcct1@gmail.com</div>
            <div>www.mpcongress.org</div>
          </div>

          <div>
            <img src={logo} alt="Logo" className="block mx-auto max-w-[48px]" />
          </div>

          <div className="text-right space-y-1">
            <div className="text-blue-900 font-bold">कार्यालय = 0755-2551512</div>
            <div>0755-2555452</div>
            <div>फैक्स = 0755-2577981</div>
          </div>
        </div>

        {/* Title & Address */}
        <div className="flex flex-col items-center mt-1 text-center">
          <div className="text-lg font-bold text-blue-900 tracking-wide font-sans">मध्यप्रदेश कांग्रेस कमेटी</div>
          <div className="text-sm text-blue-900 font-sans">इंदिरा भवन, शिवाजी नगर, भोपाल-462 016 (म.प्र.)</div>
        </div>
      </div>

      <hr className="border-t-2 border-blue-900 my-2" />

      {/* Details Section */}
      <div className="text-base text-left my-6 space-y-1 leading-relaxed">
        <div><span className="font-semibold text-blue-600">{t.name}</span> {userDetailModal.name}</div>
        <div><span className="font-semibold text-blue-600">{t.designation}</span> {userDetailModal.designation}</div>
        <div><span className="font-semibold text-blue-600">{t.eventName}</span> {userDetailModal.details?.name || ''}</div>
        <div><span className="font-semibold text-blue-600">{t.desc}</span> {userDetailModal.details?.description || ''}</div>
        <div><span className="font-semibold text-blue-600">{t.start}</span> {formatDateTime(userDetailModal.details?.start_date_time).date} {formatDateTime(userDetailModal.details?.start_date_time).time}</div>
        <div><span className="font-semibold text-blue-600">{t.end}</span> {formatDateTime(userDetailModal.details?.end_date_time).date} {formatDateTime(userDetailModal.details?.end_date_time).time}</div>
        <div><span className="font-semibold text-blue-600">{t.issue}</span> {formatDateTime(userDetailModal.details?.issue_date).date}</div>
        <div><span className="font-semibold text-blue-600">{t.location}</span> {userDetailModal.details?.location || ''}</div>
        <div><span className="font-semibold text-blue-600">{t.attendees}</span> {userDetailModal.details?.attendees || ''}</div>
        <div><span className="font-semibold text-blue-600">{t.updateDate}</span> {formatDateTime(userDetailModal.details?.update_date).date}</div>
        <div><span className="font-semibold text-blue-600">{t.type}</span> {userDetailModal.details?.type || ''}</div>
      </div>

      {/* Photos Section */}
      {photosArr.length > 0 && (
        <div className="mt-6">
          <div className="font-semibold text-gray-800 mb-2">{t.photos}</div>
          <div className="flex flex-wrap gap-3 mt-2">
            {photosArr.map((photo, idx) => (
              <img
                key={idx}
                src={photo.startsWith('http') ? photo : `${API_URL}${photo}`}
                alt="Photo"
                className="w-[90px] h-[90px] object-cover rounded-md border border-gray-300 shadow-sm bg-gray-100"
                crossOrigin="anonymous"
              />
            ))}
          </div>
        </div>
      )}

      {/* Media Photos Section */}
      {mediaPhotosArr.length > 0 && (
        <div className="mt-6">
          <div className="font-semibold text-gray-800 mb-2">{t.mediaPhotos}</div>
          <div className="flex flex-wrap gap-3 mt-2">
            {mediaPhotosArr.map((photo, idx) => (
              <img
                key={idx}
                src={photo.startsWith('http') ? photo : `${API_URL}${photo}`}
                alt="Media Photo"
                className="w-[90px] h-[90px] object-cover rounded-md border border-gray-300 shadow-sm bg-gray-100"
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
