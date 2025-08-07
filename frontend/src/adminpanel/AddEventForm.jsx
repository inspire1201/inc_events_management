import React from "react";
import Modal from "./Modal";


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
  language = "hi",
  photoError,
}) => {
  const t = TEXT[language] || TEXT.hi;

  const minDateTime = getTodayDateTimeLocal();


  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 lg:p-8 shadow-2xl max-w-2xl mx-auto border border-gray-200"
      >
        <h3 className="text-2xl font-bold text-black text-center mb-8 pb-4 border-b-2 border-black">
          {t.title}
        </h3>

        <div className="space-y-6">
          <div className="flex flex-col">
            <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.name}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors duration-200 bg-white text-black"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.desc}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors duration-200 bg-white text-black resize-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">
                {t.start}
              </label>
              <input
                type="datetime-local"
                name="start_date_time"
                value={form.start_date_time}
                onChange={handleFormChange}
                required
                min={minDateTime}
                className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors duration-200 bg-white text-black"
              />

            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.end}</label>
              <input
                type="datetime-local"
                name="end_date_time"
                value={form.end_date_time}
                onChange={handleFormChange}
                required
                min={minDateTime}  
                className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors duration-200 bg-white text-black"
              />

            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.issue}</label>
            <input
              type="date"
              name="issue_date"
              value={form.issue_date}
              onChange={handleFormChange}
              required
              readOnly
              className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">
              {t.location}
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-black transition-colors duration-200 bg-white text-black"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.type}</label>
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 appearance-none bg-white focus:outline-none focus:border-black transition-colors duration-200 text-black"
                >
                  {eventTypes.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.user}</label>
              <div className="relative">
                <select
                  name="user"
                  value={form.user}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 appearance-none bg-white focus:outline-none focus:border-black transition-colors duration-200 text-black"
                >
                  {users.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">{t.photos}</label>
            <input
              type="file"
              name="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={form.photos && form.photos.length >= 10}
              className={`w-full p-4 border-2 border-dashed ${form.photos && form.photos.length >= 10
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-gray-50 text-black border-gray-400 hover:border-black focus:border-black"
                } transition-colors duration-200`}
            />

            {photoError && <p className="text-red-600 mt-2 font-medium text-sm">{photoError}</p>}
            {form.photos && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from(form.photos).map((file, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-24 border border-gray-300 overflow-hidden bg-gray-50"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemovePhoto(idx);
                      }}
                      className="absolute -top-1 -right-1 bg-black text-white w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors duration-200"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 font-semibold border-2 border-gray-400 bg-white text-black hover:bg-gray-100 hover:border-black transition-colors duration-200"
          >
            {t.cancelBtn}
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 font-semibold bg-black text-white hover:bg-gray-800 transition-colors duration-200 border-2 border-black"
          >
            {t.addBtn}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEventForm;
