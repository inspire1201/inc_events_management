import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './UserEventUpdateForm.css';
import Swal from 'sweetalert2';
import { useLanguage } from '../context/LanguageContext';

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

const apiUrl = import.meta.env.VITE_API_URL;

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

const UserEventUpdateForm = ({
  updateForm,
  handleFormChange,
  handleFileChange,
  handleUpdateSubmit,
  eventTypes,
  onClose
}) => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.hi;

  const [localForm, setLocalForm] = useState(updateForm);
  const [localMedia, setLocalMedia] = useState({
    photos: updateForm?.photos || [],
    video: updateForm?.video || [],
    media_photos: updateForm?.media_photos || [],
  });

  const [photosProgress, setPhotosProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [mediaPhotosProgress, setMediaPhotosProgress] = useState(0);

  const [isUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const timersRef = useRef({
    photos: null,
    video: null,
    media_photos: null,
  });

  useEffect(() => {
    setLocalForm(updateForm);
    setLocalMedia({
      photos: updateForm?.photos || [],
      video: updateForm?.video || [],
      media_photos: updateForm?.media_photos || [],
    });
  }, [updateForm && updateForm.id]);

  const progressSetters = {
    photos: setPhotosProgress,
    video: setVideoProgress,
    media_photos: setMediaPhotosProgress,
  };

  const startSimulatedProgress = (name) => {
    const setProgress = progressSetters[name];
    if (!setProgress) return;

    if (timersRef.current[name]) {
      clearInterval(timersRef.current[name]);
      timersRef.current[name] = null;
    }

    setProgress(0);
    let current = 0;

    timersRef.current[name] = setInterval(() => {
      const step = Math.floor(Math.random() * 10) + 6;
      current = Math.min(100, current + step);
      setProgress(current);

      if (current >= 100) {
        clearInterval(timersRef.current[name]);
        timersRef.current[name] = null;
      }
    }, 120);
  };

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

    setLocalMedia((prev) => ({ ...prev, [name]: files }));
    handleFileChange(e);

    if (files && files.length > 0) {
      startSimulatedProgress(name);
    } else {
      if (name === 'photos') setPhotosProgress(0);
      if (name === 'video') setVideoProgress(0);
      if (name === 'media_photos') setMediaPhotosProgress(0);
    }
  };

  const handleLocalFormChange = (e) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({ ...prev, [name]: value }));
    handleFormChange(e);
  };

  const onUpdateSubmitWithProgress = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData();

      for (const key in localForm) {
        formData.append(key, localForm[key]);
      }

      if (localMedia.photos?.length) {
        for (let i = 0; i < localMedia.photos.length; i++) {
          formData.append('photos', localMedia.photos[i]);
        }
      }
      if (localMedia.video?.length) {
        for (let i = 0; i < localMedia.video.length; i++) {
          formData.append('video', localMedia.video[i]);
        }
      }
      if (localMedia.media_photos?.length) {
        for (let i = 0; i < localMedia.media_photos.length; i++) {
          formData.append('media_photos', localMedia.media_photos[i]);
        }
      }

      await axios.post(`${apiUrl}/api/event_update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      handleUpdateSubmit();


      Swal.fire({
        icon: 'success',
        title: 'Event updated successfully!',
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();


    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload failed!',
        text: error?.response?.data?.message || error.message || 'Something went wrong',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveMedia = (type, idx) => {
    setLocalMedia((prev) => {
      const arr = Array.from(prev[type]);
      arr.splice(idx, 1);
      return { ...prev, [type]: arr };
    });
    if (type === 'photos' && (!localMedia.photos || localMedia.photos.length <= 1)) setPhotosProgress(0);
    if (type === 'video' && (!localMedia.video || localMedia.video.length <= 1)) setVideoProgress(0);
    if (type === 'media_photos' && (!localMedia.media_photos || localMedia.media_photos.length <= 1)) setMediaPhotosProgress(0);
  };

  const videoArr = Array.isArray(localMedia.video)
    ? localMedia.video
    : localMedia.video
      ? [localMedia.video]
      : [];

  const isUpdateDisabled =
    (photosProgress > 0 && photosProgress < 100) ||
    (videoProgress > 0 && videoProgress < 100) ||
    (mediaPhotosProgress > 0 && mediaPhotosProgress < 100);

  return (
    <>
      <form
        onSubmit={onUpdateSubmitWithProgress}
        className="p-5 bg-gray-100 rounded-lg shadow-md"
      >
        
           <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-3xl font-bold focus:outline-none float-right"
            aria-label="Close"
          >
            &times;
          </button> 
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center">
          {t.title}
        </h2>

        <div className="mb-6">
          <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
            {t.name}
            <input
              className="w-full mt-1 p-3 border border-gray-300 rounded-md text-gray-600 bg-gray-200 cursor-not-allowed text-sm sm:text-base md:text-lg"
              name="name"
              value={localForm.name}
              readOnly
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 rounded-lg shadow-sm bg-white">
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base md:text-lg font-medium text-indigo-900 mb-2">
              {t.desc}
            </label>
            <textarea
              readOnly
              value={localForm.description || ''}
              className="w-full p-3 bg-gray-200 rounded-md text-sm sm:text-base md:text-lg min-h-[120px]"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-indigo-900 mb-2">
              {t.start}
            </label>
            <div className="p-3 bg-gray-200 rounded-md text-sm sm:text-base md:text-lg">
              {formatDateTime(localForm.start_date_time)}
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-indigo-900 mb-2">
              {t.end}
            </label>
            <div className="p-3 bg-gray-200 rounded-md text-sm sm:text-base md:text-lg">
              {formatDateTime(localForm.end_date_time)}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base md:text-lg font-medium text-indigo-900 mb-2">
              {t.issue}
            </label>
            <div className="p-3 bg-gray-200 rounded-md text-sm sm:text-base md:text-lg">
              {formatDateTime(localForm.issue_date)}
            </div>
          </div>
        </div>

        {/* Location & Attendees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
              {t.location}
              <input
                className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
                name="location"
                value={localForm.location}
                readOnly
              />
            </label>
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
              {t.attendees}
              <input
                type="number"
                name="attendees"
                value={localForm.attendees}
                onChange={handleLocalFormChange}
                required
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
          </div>
        </div>

        {/* Type */}
        <div className="mb-8">
          <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
            {t.type}
            <select
              name="type"
              value={localForm.type}
              onChange={handleLocalFormChange}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Photos */}
          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
              {t.photos}
              <input
                type="file"
                name="photos"
                multiple
                accept="image/*"
                onChange={customHandleFileChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </label>
            {photosProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${photosProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
              {t.video}
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={customHandleFileChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </label>
            {videoProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Media Photos */}
          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
              {t.mediaPhotos}
              <input
                type="file"
                name="media_photos"
                multiple
                accept="image/*"
                onChange={customHandleFileChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </label>
            {mediaPhotosProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mediaPhotosProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isUpdateDisabled}
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {t.updateBtn}
          </button>
        </div>
      </form>


      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-4 text-lg">Updating Event...</p>
        </div>
      )}
    </>
  );
};

export default UserEventUpdateForm;
