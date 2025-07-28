import React from 'react';
import Modal from './Modal';

const TEXT = {
  en: {
    title: 'Add Event',
    name: 'Event Name:',
    desc: 'Description:',
    start: 'Start Date/Time:',
    end: 'End Date/Time:',
    issue: 'Issue Date:',
    location: 'Location:',
    type: 'Event Type:',
    user: 'Select User:',
    photos: 'Photos (max 10):',
    video: 'Video (max 10 MB):',
    addBtn: 'Add',
    cancelBtn: 'Cancel',
  },
  hi: {
    title: 'आयोजन जोड़ें',
    name: 'आयोजन का नाम:',
    desc: 'विवरण:',
    start: 'प्रारंभ तिथि/समय:',
    end: 'समाप्ति तिथि/समय:',
    issue: 'जारी करने की तिथि:',
    location: 'स्थान:',
    type: 'आयोजन का प्रकार:',
    user: 'उपयोगकर्ता चुनें:',
    photos: 'फोटो (अधिकतम 10):',
    video: 'वीडियो (न्यूनतम 10 MB):',
    addBtn: 'जोड़ें',
    cancelBtn: 'रद्द करें',
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
  language = 'hi',
  photoError,
}) => {
  const t = TEXT[language] || TEXT.hi;

  return (
    <Modal onClose={onClose}>
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-8 shadow-lg max-w-lg mx-auto animate-fadeInUp">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-600">
          {t.title}
        </h3>

        {/* Input Group */}
        {/** Common label-input wrapper **/}
        <div className="space-y-5">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-2">{t.name}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-2">{t.desc}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-2">{t.start}</label>
              <input
                type="datetime-local"
                name="start_date_time"
                value={form.start_date_time}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-2">{t.end}</label>
              <input
                type="datetime-local"
                name="end_date_time"
                value={form.end_date_time}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-2">{t.issue}</label>
            <input
              type="date"
              name="issue_date"
              value={form.issue_date}
              onChange={handleFormChange}
              required
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-2">{t.location}</label>
            <input
              name="location"
              value={form.location}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-2">{t.type}</label>
              <select
                name="type"
                value={form.type}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/ %3e%3c/svg%3e')] bg-no-repeat bg-right-4 bg-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {eventTypes.map((et) => (
                  <option key={et} value={et}>{et}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-2">{t.user}</label>
              <select
                name="user"
                value={form.user}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/ %3e%3c/svg%3e')] bg-no-repeat bg-right-4 bg-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {users.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-2">{t.photos}</label>
            <input
              type="file"
              name="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-pointer focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
            {photoError && <p className="text-red-500 mt-2">{photoError}</p>}
            {form.photos && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {Array.from(form.photos).map((file, idx) => (
                  <div key={idx} className="relative w-24 h-20 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={e => { e.preventDefault(); handleRemovePhoto(idx); }}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-red-500"
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

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-semibold border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
          >
            {t.cancelBtn}
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-[1.02] transition-transform shadow-md"
          >
            {t.addBtn}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEventForm;
