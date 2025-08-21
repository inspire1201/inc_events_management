import React, { useContext } from "react";
import Modal from "./Modal";
import { useLanguage } from "../context/LanguageContext";


const getTodayDateTimeLocal = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, "0");
  const hours = pad(offset / 60);
  const minutes = pad(offset % 60);
  return now.toISOString().slice(0, 16);
};


const TEXT = {
  en: {
    title: "Add Event",
    name: "Event Name:",
    desc: "Description:",
    start: "Start Date/Time:",
    end: "End Date/Time:",
    issue: "Issue Date:",
    location: "Location:",
    type: "Event Type:",
    user: "Select User:",
    photos: "Photos (max 10):",
    video: "Video (max 10 MB):",
    addBtn: "Add",
    cancelBtn: "Cancel",
  },
  hi: {
    title: "आयोजन जोड़ें",
    name: "आयोजन का नाम:",
    desc: "विवरण:",
    start: "प्रारंभ तिथि/समय:",
    end: "समाप्ति तिथि/समय:",
    issue: "जारी करने की तिथि:",
    location: "स्थान:",
    type: "आयोजन का प्रकार:",
    user: "उपयोगकर्ता चुनें:",
    photos: "फोटो (अधिकतम 10):",
    video: "वीडियो (न्यूनतम 10 MB):",
    addBtn: "जोड़ें",
    cancelBtn: "रद्द करें",
  },
};

const AddEventForm = ({
  form,
  eventTypes,
  users,
  onSubmit,
  onClose,
  handleFormChange,
  handleFileChange,
  handleRemovePhoto,
  photoError,
}) => {

  const { language } = useLanguage();

  const t = TEXT[language] || TEXT.hi;

  const minDateTime = getTodayDateTimeLocal();



  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto border border-gray-300 rounded-lg shadow-lg"
    >
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-red-600 text-3xl font-bold focus:outline-none float-right m-b-4"
        aria-label="Close"
      >
        &times;
      </button>
      {/* Title */}
      <h3 className="text-2xl font-bold text-black text-center mb-6 border-b border-gray-300 pb-4">
        {t.title}

      </h3>


      {/* Form Fields */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">

        {/* Name */}
        <div className="flex flex-col">
          <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.name}</label>
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-md bg-white text-black transition"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col lg:col-span-1">
          <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.desc}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFormChange}
            required
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-md bg-white text-black resize-y"
          />
        </div>
      </div>

      {/* Dates Row - Desktop: All in one line */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.start}</label>
          <input
            type="datetime-local"
            name="start_date_time"
            value={form.start_date_time}
            onChange={handleFormChange}
            min={minDateTime}
            required
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-md bg-white text-black"
          />
        </div>
        {/* End Date */}
        <div className="flex flex-col">
          <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.end}</label>
          <input
            type="datetime-local"
            name="end_date_time"
            value={form.end_date_time}
            onChange={handleFormChange}
            min={minDateTime}
            required
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-md bg-white text-black"
          />
        </div>
        {/* Issue Date */}
        {/* <div className="flex flex-col">
          <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.issue}</label>
          <input
            type="datetime-local"
            name="issue_date"
            readOnly
            required
            className="w-full px-4 py-3 border border-gray-200 bg-gray-100 text-gray-600 rounded-md cursor-not-allowed"
          />
        </div> */}
      </div>

      {/* Location */}
      <div className="mt-4">
        <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.location}</label>
        <input
          name="location"
          value={form.location}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded-md bg-white text-black"
        />
      </div>

      {/* Type & User */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.type}</label>
          <select
            name="type"
            value={form.type}
            onChange={handleFormChange}
            className="w-full px-4 py-3 border border-gray-300 appearance-none bg-white rounded-md focus:outline-none focus:border-black text-black"
          >
            {eventTypes.map((et) => (
              <option key={et} value={et}>
                {et}
              </option>
            ))}
          </select>
        </div>

        {/* User */}
        <div>
          <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.user}</label>
          <select
            name="user"
            value={form.user}
            onChange={handleFormChange}
            className="w-full px-4 py-3 border border-gray-300 appearance-none bg-white rounded-md focus:outline-none focus:border-black text-black"
          >
            {users.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Photos Upload */}
      <div className="mt-6">
        <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.photos}</label>
        <input
          type="file"
          name="photos"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={form.photos && form.photos.length >= 10}
          className={`w-full p-3 border-2 border-dashed rounded-md transition ${form.photos && form.photos.length >= 10
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-gray-50 text-black border-gray-300 hover:border-black focus:border-black"
            }`}
        />
        {photoError && <p className="text-red-600 mt-2 text-sm">{photoError}</p>}
        {form.photos && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from(form.photos).map((file, idx) => (
              <div key={idx} className="relative h-24 border border-gray-300 rounded-md overflow-hidden">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemovePhoto(idx);
                  }}
                  className="absolute top-1 right-1 bg-black text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 border border-gray-400 rounded-md bg-white text-black hover:bg-gray-100 transition"
        >
          {t.cancelBtn}
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 transition"
        >
          {t.addBtn}
        </button>
      </div>
    </form>
  );
};

export default AddEventForm;
