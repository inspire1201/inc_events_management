import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useLanguage } from "../context/LanguageContext";

const TEXT = {
  en: {
    title: "Update Event",
    name: "Event Name:",
    desc: "Description:",
    start: "Start Date/Time:",
    end: "End Date/Time:",
    issue: "Issue Date:",
    location: "Location:",
    attendees: "Number of Attendees:",
    type: "Event Type:",
    photos: "Photos (max 10):",
    video: "Video (max 10 MB):",
    mediaPhotos: "Media Coverage Photos (max 5):",
    youtubeUrl: "YouTube Video URL:",
    otherUrls: "Other URLs (comma separated):",
    updateBtn: "Update",
    urlPlaceholder: "https://youtube.com/watch?v=...",
    otherUrlsPlaceholder: "https://example1.com, https://example2.com",
    pdf: "PDF Document (max 5 MB):", // Added PDF field text
  },
  hi: {
    title: "आयोजन अपडेट करें",
    name: "आयोजन का नाम:",
    desc: "विवरण:",
    start: "प्रारंभ तिथि/समय:",
    end: "समाप्ति तिथि/समय:",
    issue: "जारी करने की तिथि:",
    location: "स्थान:",
    attendees: "उपस्थित लोगों की संख्या:",
    type: "आयोजन का प्रकार:",
    photos: "फोटो (अधिकतम 10):",
    video: "वीडियो (अधिकतम 10 MB):",
    mediaPhotos: "मीडिया कवरेज फोटो (अधिकतम 5):",
    youtubeUrl: "YouTube वीडियो URL:",
    otherUrls: "अन्य URLs (comma separated):",
    updateBtn: "अपडेट करें",
    urlPlaceholder: "https://youtube.com/watch?v=...",
    otherUrlsPlaceholder: "https://example1.com, https://example2.com",
    pdf: "PDF दस्तावेज़ (अधिकतम 5 MB):", // Added PDF field text
  },
};

function formatDateTimeDisplay(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const UserEventUpdateForm = ({
  updateForm,
  eventTypes,
  onClose,
  eventId,
  userId,
  onSubmitWithProgress,
}) => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.hi;

  const [localForm, setLocalForm] = useState({
    ...updateForm,
    media_video_urls: updateForm?.media_video_urls || "",
    media_other_urls: updateForm?.media_other_urls || "",
  });

  const [localMedia, setLocalMedia] = useState({
    photos: updateForm?.photos || [],
    video: Array.isArray(updateForm?.video)
      ? updateForm.video
      : updateForm?.video
        ? [updateForm.video]
        : [],
    media_photos: updateForm?.media_photos || [],
    pdf: updateForm?.pdf || null, // Added PDF to localMedia
  });

  const [photosProgress, setPhotosProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [mediaPhotosProgress, setMediaPhotosProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0); // Added PDF progress
  const [isUpdating, setIsUpdating] = useState(false);

  const timersRef = useRef({ photos: null, video: null, media_photos: null, pdf: null }); // Added PDF timer

  useEffect(() => {
    if (!updateForm) return;
    setLocalForm((prev) => ({
      ...prev,
      ...updateForm,
      media_video_urls: updateForm?.media_video_urls || "",
      media_other_urls: updateForm?.media_other_urls || "",
    }));
    setLocalMedia({
      photos: updateForm?.photos || [],
      video: Array.isArray(updateForm?.video)
        ? updateForm.video
        : updateForm?.video
          ? [updateForm.video]
          : [],
      media_photos: updateForm?.media_photos || [],
      pdf: updateForm?.pdf || null, // Initialize PDF from updateForm
    });
  }, [updateForm]);

  const progressSetters = {
    photos: setPhotosProgress,
    video: setVideoProgress,
    media_photos: setMediaPhotosProgress,
    pdf: setPdfProgress, // Added PDF progress setter
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

  const handleLocalFormChange = (e) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({ ...prev, [name]: value }));
  };

  const customHandleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "photos" && files.length > 10) {
      Swal.fire({
        icon: "warning",
        title: "अधिकतम 10 फोटो ही चुन सकते हैं! (Max 10 images allowed)",
        text: "आप एक बार में 10 से ज्यादा फोटो अपलोड नहीं कर सकते।",
      });
      e.target.value = "";
      return;
    }
    if (name === "media_photos" && files.length > 5) {
      Swal.fire({
        icon: "warning",
        title: "अधिकतम 5 मीडिया फोटो ही चुन सकते हैं! (Max 5 media images allowed)",
        text: "आप एक बार में 5 से ज्यादा मीडिया फोटो अपलोड नहीं कर सकते।",
      });
      e.target.value = "";
      return;
    }
    if (name === "video" && files?.length) {
      const tooBig = Array.from(files).some((f) => f.size > 10 * 1024 * 1024);
      if (tooBig) {
        Swal.fire({
          icon: "warning",
          title: "Video too large",
          text: "Please upload video(s) up to 10 MB.",
        });
        e.target.value = "";
        return;
      }
    }
    
    // PDF validation
    if (name === "pdf" && files?.length) {
      const file = files[0];
      // Check if file is PDF
      if (file.type !== "application/pdf") {
        Swal.fire({
          icon: "warning",
          title: language === "hi" ? "अमान्य फ़ाइल प्रकार" : "Invalid file type",
          text: language === "hi" 
            ? "कृपया केवल PDF फ़ाइलें अपलोड करें।" 
            : "Please upload only PDF files.",
        });
        e.target.value = "";
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: language === "hi" ? "फ़ाइल बहुत बड़ी है" : "File too large",
          text: language === "hi" 
            ? "कृपया 5 MB से छोटी PDF फ़ाइलें अपलोड करें।" 
            : "Please upload PDF files smaller than 5 MB.",
        });
        e.target.value = "";
        return;
      }
    }

    setLocalMedia((prev) => ({ ...prev, [name]: files }));

    if (files && files.length > 0) {
      startSimulatedProgress(name);
    } else {
      if (name === "photos") setPhotosProgress(0);
      if (name === "video") setVideoProgress(0);
      if (name === "media_photos") setMediaPhotosProgress(0);
      if (name === "pdf") setPdfProgress(0); // Reset PDF progress
    }
  };

  const allowedKeys = [
    "name",
    "description",
    "start_date_time",
    "end_date_time",
    "issue_date",
    "location",
    "attendees",
    "type",
    "media_video_urls",
    "media_other_urls",
  ];

  const onUpdateSubmitWithProgress = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData();

      formData.append("event_id", updateForm?.id || eventId);
      formData.append("user_id", userId);

      allowedKeys.forEach((key) => {
        if (localForm[key] !== undefined && localForm[key] !== null) {
          formData.append(key, localForm[key]);
        }
      });

      if (localMedia.photos?.length) {
        Array.from(localMedia.photos).forEach((f) => formData.append("photos", f));
      }
      if (localMedia.video?.length) {
        Array.from(localMedia.video).forEach((f) => formData.append("video", f));
      }
      if (localMedia.media_photos?.length) {
        Array.from(localMedia.media_photos).forEach((f) => formData.append("media_photos", f));
      }
      if (localMedia.pdf?.length) {
        Array.from(localMedia.pdf).forEach((f) => formData.append("pdf", f)); // Append PDF files
      }

      onSubmitWithProgress(formData);
      onClose?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload failed!",
        text: error?.message || "Something went wrong",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isUpdateDisabled =
    (photosProgress > 0 && photosProgress < 100) ||
    (videoProgress > 0 && videoProgress < 100) ||
    (mediaPhotosProgress > 0 && mediaPhotosProgress < 100) ||
    (pdfProgress > 0 && pdfProgress < 100); // Added PDF progress check

  const toDatetimeLocal = (d) => (d ? new Date(d).toISOString().slice(0, 16) : "");

  const removeFile = (type, index) => {
    setLocalMedia((prev) => {
      if (type === "pdf") {
        // For PDF, we just clear it since it's a single file
        return { ...prev, [type]: null };
      }
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return { ...prev, [type]: updated };
    });
  };

  return (
    <>
      <form
        onSubmit={onUpdateSubmitWithProgress}
        className="p-5 bg-gray-100 rounded-lg shadow-md"
      >
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 text-3xl font-bold focus:outline-none float-right"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center">
          {t.title}
        </h2>

        {/* Event Name */}
        <div className="mb-6">
          <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
            {t.name}
            <input
              className="w-full mt-1 p-3 border border-gray-300 rounded-md text-gray-600 bg-gray-200 cursor-not-allowed text-sm sm:text-base md:text-lg"
              name="name"
              value={localForm.name || ""}
              readOnly
            />
          </label>
        </div>

        {/* Description, Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 rounded-lg shadow-sm bg-white">
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base md:text-lg font-medium text-indigo-900 mb-2">
              {t.desc}
            </label>
            <textarea
              readOnly
              value={localForm.description || ""}
              className="w-full p-3 bg-gray-200 rounded-md text-sm sm:text-base md:text-lg min-h-[120px]"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-indigo-900 mb-2">
              {t.start}
            </label>
            <input
              type="datetime-local"
              name="start_date_time"
              value={toDatetimeLocal(localForm.start_date_time)}
              onChange={handleLocalFormChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-sm sm:text-base md:text-lg"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-indigo-900 mb-2">
              {t.end}
            </label>
            <input
              type="datetime-local"
              name="end_date_time"
              value={toDatetimeLocal(localForm.end_date_time)}
              onChange={handleLocalFormChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-sm sm:text-base md:text-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base md:text-lg font-medium text-indigo-900 mb-2">
              {t.issue}
            </label>
            <div className="p-3 bg-gray-200 rounded-md text-sm sm:text-base md:text-lg">
              {formatDateTimeDisplay(localForm.issue_date)}
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
                value={localForm.location || ""}
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
                value={localForm.attendees || ""}
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
              value={localForm.type || ""}
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

        {/* NEW: YouTube URL and Other URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
              {t.youtubeUrl}
              <input
                type="url"
                name="media_video_urls"
                value={localForm.media_video_urls || ""}
                onChange={handleLocalFormChange}
                placeholder={t.urlPlaceholder}
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
              {t.otherUrls}
              <input
                type="text"
                name="media_other_urls"
                value={localForm.media_other_urls || ""}
                onChange={handleLocalFormChange}
                placeholder={t.otherUrlsPlaceholder}
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
          </div>
        </div>

        {/* File Uploads - Updated to include PDF */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
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
                />
              </div>
            )}

            {/* Photos Preview */}
            {localMedia.photos?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from(localMedia.photos).map((file, idx) => {
                  const url = file instanceof File ? URL.createObjectURL(file) : file;
                  return (
                    <div key={idx} className="relative h-24 border border-gray-300 rounded-md overflow-hidden">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile("photos", idx)}
                        className="absolute top-1 right-1 bg-black text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
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
                />
              </div>
            )}

            {/* Video Preview */}
            {localMedia.video?.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-3">
                {Array.from(localMedia.video).map((file, idx) => {
                  const url = file instanceof File ? URL.createObjectURL(file) : file;
                  return (
                    <div key={idx} className="relative h-40 border border-gray-300 rounded-md overflow-hidden">
                      <video src={url} controls className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile("video", idx)}
                        className="absolute top-1 right-1 bg-black text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
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
                />
              </div>
            )}

            {/* Media Photos Preview */}
            {localMedia.media_photos?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from(localMedia.media_photos).map((file, idx) => {
                  const url = file instanceof File ? URL.createObjectURL(file) : file;
                  return (
                    <div key={idx} className="relative h-24 border border-gray-300 rounded-md overflow-hidden">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile("media_photos", idx)}
                        className="absolute top-1 right-1 bg-black text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2">
              {t.pdf}
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                onChange={customHandleFileChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </label>

            {pdfProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${pdfProgress}%` }}
                />
              </div>
            )}

            {/* PDF Preview */}
            {localMedia.pdf && (
              <div className="mt-4">
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md border border-gray-300">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {localMedia.pdf[0]?.name || "PDF Document"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {localMedia.pdf[0]?.size ? `${(localMedia.pdf[0].size / 1024 / 1024).toFixed(2)} MB` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("pdf")}
                    className="text-gray-500 hover:text-red-600 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdateDisabled || isUpdating}
          className={`w-full py-3 text-white font-semibold rounded-md transition ${isUpdateDisabled || isUpdating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {t.updateBtn}
        </button>
      </form>
    </>
  );
};

export default UserEventUpdateForm;