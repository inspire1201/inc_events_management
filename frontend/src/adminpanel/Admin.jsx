import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "./Modal.jsx";
import AddEventForm from "./AddEventForm.jsx";
import EventReport from "./EventReport.jsx";
import UserDetailModal from "./UserDetailModal.jsx";
import { useNavigate } from "react-router-dom";
import { Clock3, History, PlusCircle } from "lucide-react";

const TEXT = {
  en: {
    lastVisit: "Your last visit:",
    monthlyCount: "Visits this month:",
    ongoing: "Ongoing Events",
    previous: "Previous Events",
    addEvent: "Add Event",
    sn: "S.no",
    eventDetails: "Event Details",
    startDate: "Start Date",
    endDate: "End Date",
    action: "Action",
    showReport: "Report",
    noVisit: "No visit",
    eventAdded: "Event added successfully!",
    eventAddFailed: "Failed to add event. Please try again.",
    error: "An error occurred. Please try again.",
    addingEvent: "Adding Event...",
    pleaseWait: "Please wait while we add your event",
    report: "Report",
    close: "Close",
  },
  hi: {
    lastVisit: "आपकी अंतिम यात्रा:",
    monthlyCount: "इस माह की यात्राएँ:",
    ongoing: "चल रहे आयोजन",
    previous: "पिछले आयोजन",
    addEvent: "आयोजन जोड़ें",
    sn: "क्र.सं",
    eventDetails: "आयोजन विवरण ",
    startDate: "प्रारंभ तिथि",
    endDate: "समाप्ति तिथि",
    action: "कार्रवाई",
    showReport: "रिपोर्ट दिखाएं",
    noVisit: "कोई यात्रा नहीं",
    eventAdded: "आयोजन सफलतापूर्वक जोड़ा गया!",
    eventAddFailed: "आयोजन जोड़ना विफल। कृपया पुनः प्रयास करें।",
    error: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    addingEvent: "आयोजन जोड़ रहे हैं...",
    pleaseWait: "कृपया प्रतीक्षा करें जबकि हम आपका आयोजन जोड़ रहे हैं",
    report: "रिपोर्ट",
    close: "बंद करें",
  },
};

const eventTypes = ["धरना", "बैठक", "बंद", "रैली", "सभा", "गायपान"];
const users = ["All Jila Addhyaksh"];

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes} ${ampm}`,
  };
};

const Admin = ({ language = "hi" }) => {
  const t = TEXT[language] || TEXT.hi;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReport, setShowReport] = useState(null);
  const [filter, setFilter] = useState("ongoing");
  const [events, setEvents] = useState([]);
  const [userDetailModal, setUserDetailModal] = useState(null);
  const [lastVisit, setLastVisit] = useState("");
  const [monthlyCount, setMonthlyCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [loadedDraftId, setLoadedDraftId] = useState(null);

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    if (!user || !role) {
      navigate("/", { replace: true });
    } else if (role !== "admin") {
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date_time: "",
    end_date_time: "",
    issue_date: today,
    type: eventTypes[0],
    user: users[0],
    location: "",
    photos: null,
  });

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  useEffect(() => {
    if (!user) return; 

    fetch(`${apiUrl}/api/user_visits/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setLastVisit(
          data.last_visit ? formatDateTime(data.last_visit).date : t.noVisit
        );
        setMonthlyCount(data.monthly_count || 0);
      })
      .catch((err) => console.error("Error fetching visits:", err));

    fetch(`${apiUrl}/api/events?status=${filter}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, [filter, user, t.noVisit]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const maxFiles = 10;

    const limitedFiles = selectedFiles.slice(0, maxFiles);

    if (selectedFiles.length > maxFiles) {
      alert("Only the first 10 images will be used.");
    }

    setForm((prev) => ({
      ...prev,
      photos: limitedFiles,
    }));
  };

  const handleRemovePhoto = (idx) => {
    if (!form.photos) return;
    const dt = new DataTransfer();
    Array.from(form.photos).forEach((file, i) => {
      if (i !== idx) dt.items.add(file);
    });
    setForm((prev) => ({ ...prev, photos: dt.files.length ? dt.files : null }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: t.addingEvent,
      text: t.pleaseWait,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "photos" && value) {
        Array.from(value).forEach((file) => formData.append("photos", file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch(`${apiUrl}/api/event_add`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: t.eventAdded,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          setShowAddModal(false);
        });
        setForm({
          name: "",
          description: "",
          start_date_time: "",
          end_date_time: "",
          issue_date: today,
          type: eventTypes[0],
          user: users[0],
          location: "",
          photos: null,
        });
        fetch(`${apiUrl}/api/events?status=${filter}`)
          .then((res) => res.json())
          .then((data) => setEvents(data));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: t.eventAddFailed,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Add event error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: t.error,
        confirmButtonText: "OK",
      });
    }
  };

  const handleShowReport = (event) => {
    fetch(`${apiUrl}/api/event_report/${event.id}`)
      .then((res) => res.json())
      .then((data) =>
        setShowReport({ ...event, users: data.users, event: data.event })
      )
      .catch((err) => console.error("Error fetching report:", err));
  };

  const handleShowUserDetails = (event_id, user) => {
    fetch(`${apiUrl}/api/event_user_details/${event_id}/${user.ID}`)
      .then((res) => res.json())
      .then((data) => setUserDetailModal({ ...user, details: data }))
      .catch((err) => console.error("Error fetching user details:", err));
  };

  const resetForm = () =>
    setForm({
      name: "",
      description: "",
      start_date_time: "",
      end_date_time: "",
      issue_date: today,
      type: eventTypes[0],
      user: users[0],
      location: "",
      photos: null,
    });

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const base64ToFile = (base64, filename, mimeType) => {
    const arr = base64.split(",");
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mimeType });
  };

  const refreshDrafts = () => {
    const allDrafts = JSON.parse(
      localStorage.getItem("eventFormDrafts") || "[]"
    );
    setDrafts(allDrafts);
  };

  useEffect(() => {
    refreshDrafts();
  }, []);

  const saveDraft = async () => {
    let photosBase64 = null;
    let videoBase64 = null;
    if (form.photos) {
      photosBase64 = await Promise.all(
        Array.from(form.photos).map(fileToBase64)
      );
    }
    if (form.video) {
      const videoFile = form.video[0];
      if (videoFile) {
        if (videoFile.size > 4 * 1024 * 1024) {
          Swal.fire({
            icon: "warning",
            title: "Video too large for draft",
            text: "वीडियो बहुत बड़ा है, ड्राफ्ट में सेव नहीं किया जाएगा। Video is too large to save in draft.",
          });
        } else {
          videoBase64 = [await fileToBase64(videoFile)];
        }
      }
    }
    let draftsArr = JSON.parse(localStorage.getItem("eventFormDrafts") || "[]");
    if (loadedDraftId !== null) {
      draftsArr = draftsArr.map((d) =>
        d.id === loadedDraftId
          ? {
              ...d,
              name:
                form.name || (language === "hi" ? "कोई नाम नहीं" : "No Name"),
              savedAt: new Date().toISOString(),
              data: { ...form, photos: photosBase64, video: videoBase64 },
            }
          : d
      );
      Swal.fire({
        icon: "success",
        title: language === "hi" ? "ड्राफ्ट अपडेट हुआ!" : "Draft Updated!",
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      draftsArr.push({
        id: Date.now(),
        name: form.name || (language === "hi" ? "कोई नाम नहीं" : "No Name"),
        savedAt: new Date().toISOString(),
        data: { ...form, photos: photosBase64, video: videoBase64 },
      });
      Swal.fire({
        icon: "success",
        title: language === "hi" ? "ड्राफ्ट सेव हो गया!" : "Draft Saved!",
        timer: 1200,
        showConfirmButton: false,
      });
    }
    localStorage.setItem("eventFormDrafts", JSON.stringify(draftsArr));
    refreshDrafts();
    setShowDrafts(false);
    setLoadedDraftId(null);
  };

  const loadDraft = async (draftId = null) => {
    let drafts = JSON.parse(localStorage.getItem("eventFormDrafts") || "[]");
    let draft = null;
    if (draftId) {
      draft = drafts.find((d) => d.id === draftId);
    } else if (drafts.length > 0) {
      draft = drafts[drafts.length - 1];
    }
    if (draft) {
      const parsed = draft.data;
      let photosFiles = null;
      let videoFiles = null;
      if (parsed.photos && Array.isArray(parsed.photos)) {
        photosFiles = new DataTransfer();
        parsed.photos.forEach((b64, idx) => {
          const mime = b64.substring(b64.indexOf(":") + 1, b64.indexOf(";"));
          const file = base64ToFile(
            b64,
            `photo${idx}.${mime.split("/")[1] || "jpg"}`,
            mime
          );
          photosFiles.items.add(file);
        });
        photosFiles = photosFiles.files;
      }
      if (parsed.video && Array.isArray(parsed.video) && parsed.video[0]) {
        const b64 = parsed.video[0];
        const mime = b64.substring(b64.indexOf(":") + 1, b64.indexOf(";"));
        const file = base64ToFile(
          b64,
          `video.${mime.split("/")[1] || "mp4"}`,
          mime
        );
        const dt = new DataTransfer();
        dt.items.add(file);
        videoFiles = dt.files;
      }
      setForm({ ...parsed, photos: photosFiles, video: videoFiles });
    } else {
      resetForm();
    }
  };

  const removeDraft = (draftId) => {
    let drafts = JSON.parse(localStorage.getItem("eventFormDrafts") || "[]");
    drafts = drafts.filter((d) => d.id !== draftId);
    localStorage.setItem("eventFormDrafts", JSON.stringify(drafts));
    Swal.fire({
      icon: "success",
      title: language === "hi" ? "ड्राफ्ट हटाया गया!" : "Draft Deleted!",
      timer: 1200,
      showConfirmButton: false,
    });
    refreshDrafts();
  };

  const handleCancelAddEvent = () => {
    Swal.fire({
      title: "Discard changes?",
      text: "क्या आप फॉर्म को डिस्कार्ड करना चाहते हैं?\nDo you want to discard the form?",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Discard",
      denyButtonText: "Save Draft",
      cancelButtonText: "Continue Updating",
      customClass: {
        confirmButton: "swal2-confirm",
        denyButton: "swal2-deny",
        cancelButton: "swal2-cancel",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        resetForm();
        removeDraft();
        setShowAddModal(false);
      } else if (result.isDenied) {
        await saveDraft();
        setShowAddModal(false);
      }
    });
  };

  const handleOpenAddModal = async () => {
    await loadDraft();
    setShowAddModal(true);
    setLoadedDraftId(null);
  };

  const handleLoadDraft = async (draftId) => {
    await loadDraft(draftId);
    setShowAddModal(true);
    setShowDrafts(false);
    setLoadedDraftId(draftId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Info Section */}
        <div className="bg-white shadow-sm border border-gray-200 p-4 lg:p-6 mb-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">
                {t.lastVisit}
              </span>
              <span className="text-sm text-gray-900 font-semibold">
                {lastVisit}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">
                {t.monthlyCount}
              </span>
              <span className="text-sm text-gray-900 font-semibold">
                {monthlyCount}
              </span>
            </div>
          </div>
        </div>

        {/* Draft Button Section */}
        <div className="flex justify-end mb-6 relative">
          <button
            onClick={() => setShowDrafts((v) => !v)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {language === "hi" ? "ड्राफ्ट" : "Draft"}
          </button>
          {showDrafts && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg min-w-80 z-20 p-4">
              <div className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                {language === "hi" ? "ड्राफ्ट्स" : "Drafts"}
              </div>
              {drafts.length === 0 ? (
                <div className="text-gray-500 text-sm py-4 text-center">
                  {language === "hi" ? "कोई ड्राफ्ट नहीं" : "No drafts"}
                </div>
              ) : (
                <div className="space-y-3">
                  {drafts
                    .slice()
                    .reverse()
                    .map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 border border-gray-100"
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="font-medium text-gray-900 truncate">
                            {d.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(d.savedAt).toLocaleString(
                              language === "hi" ? "hi-IN" : "en-US"
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 transition-colors duration-200"
                            onClick={() => handleLoadDraft(d.id)}
                          >
                            {language === "hi" ? "लोड" : "Load"}
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 transition-colors duration-200"
                            onClick={() => removeDraft(d.id)}
                          >
                            {language === "hi" ? "हटाएं" : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter and Add Button Row */}
        <div className="bg-white shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <label
                className={`flex items-center px-4 py-2 rounded-full border cursor-pointer transition ${
                  filter === "ongoing"
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  checked={filter === "ongoing"}
                  onChange={() => setFilter("ongoing")}
                  className="hidden"
                />
                <Clock3 className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{t.ongoing}</span>
              </label>

              <label
                className={`flex items-center px-4 py-2 rounded-full border cursor-pointer transition ${
                  filter === "previous"
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  checked={filter === "previous"}
                  onChange={() => setFilter("previous")}
                  className="hidden"
                />
                <History className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{t.previous}</span>
              </label>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center px-4 py-2 rounded-full border bg-purple-100 border-purple-500 text-purple-700 hover:bg-purple-200 transition"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{t.addEvent}</span>
            </button>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t.sn}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t.eventDetails}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t.startDate}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t.endDate}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((ev, idx) => (
                  <tr
                    key={ev.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {idx + 1}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        className="text-sm text-orange-600 hover:text-orange-800 font-medium hover:underline focus:outline-none"
                        onClick={() => handleShowReport(ev)}
                      >
                        {ev.name}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatDateTime(ev.start_date_time).date}
                        </div>
                        <div className="text-gray-600">
                          {formatDateTime(ev.start_date_time).time}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatDateTime(ev.end_date_time).date}
                        </div>
                        <div className="text-gray-600">
                          {formatDateTime(ev.end_date_time).time}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        className="bg-gray-800 hover:bg-black text-white text-sm font-medium px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        onClick={() => handleShowReport(ev)}
                      >
                        {t.showReport}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg font-medium mb-2">
                No events found
              </div>
              <div className="text-gray-400 text-sm">
                Try adjusting your filter or add a new event
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddModal && (
          <Modal onClose={handleCancelAddEvent}>
            <AddEventForm
              form={form}
              eventTypes={eventTypes}
              users={users}
              onSubmit={handleAddEvent}
              onClose={handleCancelAddEvent}
              handleFormChange={handleFormChange}
              handleFileChange={handleFileChange}
              handleRemovePhoto={handleRemovePhoto}
              language={language}
            />
          </Modal>
        )}

        {showReport && (
          <EventReport
            showReport={showReport}
            onClose={() => setShowReport(null)}
            handleShowUserDetails={handleShowUserDetails}
            formatDateTime={formatDateTime}
            language={language}
          />
        )}

        {userDetailModal && (
          <UserDetailModal
            userDetailModal={userDetailModal}
            onClose={() => setUserDetailModal(null)}
            formatDateTime={formatDateTime}
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
