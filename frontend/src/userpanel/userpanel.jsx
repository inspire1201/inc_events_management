// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";

// import './userpanel.css';
// import Modal from './Modal';
// import UserEventDetails from './UserEventDetails';
// import UserEventUpdateForm from './UserEventUpdateForm';
// import Swal from 'sweetalert2';

// const TEXT = {
//   en: {
//     lastVisit: 'Your last visit:',
//     monthlyCount: 'Visits this month:',
//     ongoing: 'Ongoing Events',
//     previous: 'Previous Events',
//     sn: 'S. No.',
//     eventDetails: 'Event Details ',
//     eventDate: 'Event Date ',
//     action: 'Action',
//     showDetails: 'Details',
//     update: 'Update',
//     noEvents: 'No events found.',
//     cannotUpdate: 'Previous event details cannot be updated.',
//     updateSuccess: 'Event updated successfully',
//     updateFailed: 'Failed to update event',
//     error: 'An error occurred. Please try again.',
//     startEventDate: 'Start Date',
//     endEventDate: 'End Date',
//   },
//   hi: {
//     lastVisit: 'आपकी अंतिम यात्रा:',
//     monthlyCount: 'इस माह की यात्राएँ:',
//     ongoing: 'चल रहे आयोजन',
//     previous: 'पिछले आयोजन',
//     sn: 'क्रम संख्या',
//     eventDetails: 'आयोजन विवरण ',
//     eventDate: 'आयोजन तिथि ',
//     action: 'कार्रवाई',
//     showDetails: 'दिखाएं',
//     update: 'अपडेट करें',
//     noEvents: 'कोई आयोजन नहीं मिला।',
//     cannotUpdate: 'पिछले आयोजन का विवरण अपडेट नहीं किया जा सकता।',
//     updateSuccess: 'आयोजन अपडेट सफल',
//     updateFailed: 'आयोजन अपडेट विफल',
//     error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
//     startEventDate: 'प्रारंभ तिथि',
//     endEventDate: 'समाप्ति तिथि',
//   },
// };

// const eventTypes = [
//   'धरना', 'बैठक', 'बंद', 'रैली', 'सभा', 'गायपान'
// ];

// const formatDateTime = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   const hours = date.getHours() % 12 || 12;
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
//   return {
//     date: `${day}-${month}-${year}`,
//     time: `${hours}:${minutes} ${ampm}`,
//   };
// };

// const UserPanel = ({ language = 'hi' }) => {
//   const t = TEXT[language] || TEXT.hi;
//   const [eventType, setEventType] = useState('ongoing');
//   const [modalType, setModalType] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [updateForm, setUpdateForm] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [lastVisit, setLastVisit] = useState('');
//   const [monthlyCount, setMonthlyCount] = useState(0);
//   const user = JSON.parse(localStorage.getItem('user'));
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     const user = localStorage.getItem("user");
//     const role = localStorage.getItem("role");
//     if (!user || !role) {
//       navigate("/", { replace: true });
//     } else if (role !== "user") {
//       localStorage.removeItem("role");
//       localStorage.removeItem("user");
//       navigate("/", { replace: true });
//     }
//   }, [navigate]);

//   const apiUrl = import.meta.env.VITE_REACT_APP_API_URL

//   useEffect(() => {
//     fetch(`${apiUrl}/api/user_visits/${user.id}`)
//       .then(res => res.json())
//       .then(resData => {
//         setLastVisit(resData.last_visit ? formatDateTime(resData.last_visit).date : t.noVisit);
//         setMonthlyCount(resData.monthly_count || 0);
//       })
//       .catch(err => console.error('Error fetching visits:', err));

//     fetch(`${apiUrl}/api/events?status=${eventType}&user_id=${user.id}`)
//       .then(res => res.json())
//       .then(data => {
//         setEvents(data);
//       })
//       .catch(err => console.error('Error fetching events:', err));
//   }, [eventType, user.id, t.noVisit]);

//   const handleShowDetails = (event) => {
//     setSelectedEvent(event);
//     setModalType('details');

//     fetch(`${apiUrl}/api/event_view`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ event_id: event.id, user_id: user.id }),
//     })
//       .then(() => console.log('Event marked as viewed'))
//       .catch(err => console.error('Error marking view:', err));
//   };

//   const handleUpdate = async (event) => {
//     setSelectedEvent(event);
//     const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
//     const user = JSON.parse(localStorage.getItem('user'));
//     try {
//       const res = await fetch(`${apiUrl}/api/event_user_details/${event.id}/${user.id}`);
//       if (res.ok) {
//         const data = await res.json();
//         setUpdateForm({
//           ...event, // fallback: event object se details
//           ...data,  // backend data overwrite karega
//           photos: data.photos ? (typeof data.photos === 'string' ? JSON.parse(data.photos) : data.photos) : (event.photos ? (typeof event.photos === 'string' ? JSON.parse(event.photos) : event.photos) : []),
//           media_photos: data.media_photos ? (typeof data.media_photos === 'string' ? JSON.parse(data.media_photos) : data.media_photos) : (event.media_photos ? (typeof event.media_photos === 'string' ? JSON.parse(event.media_photos) : event.media_photos) : []),
//           video: data.video ? (Array.isArray(data.video) ? data.video : [data.video]) : (event.video ? (Array.isArray(event.video) ? event.video : [event.video]) : [])
//         });
//       } else {
//         setUpdateForm({
//           ...event,
//           photos: event.photos ? (typeof event.photos === 'string' ? JSON.parse(event.photos) : event.photos) : [],
//           media_photos: event.media_photos ? (typeof event.media_photos === 'string' ? JSON.parse(event.media_photos) : event.media_photos) : [],
//           video: event.video ? (Array.isArray(event.video) ? event.video : [event.video]) : []
//         });
//       }
//     } catch {
//       setUpdateForm({
//         ...event,
//         photos: event.photos ? (typeof event.photos === 'string' ? JSON.parse(event.photos) : event.photos) : [],
//         media_photos: event.media_photos ? (typeof event.media_photos === 'string' ? JSON.parse(event.media_photos) : event.media_photos) : [],
//         video: event.video ? (Array.isArray(event.video) ? event.video : [event.video]) : []
//       });
//     }
//     setModalType('update');
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (name === 'photos' && files.length > 10) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'अधिकतम 10 फोटो ही चुन सकते हैं! (Max 10 images allowed)',
//         text: 'आप एक बार में 10 से ज्यादा फोटो अपलोड नहीं कर सकते।',
//       });
//       e.target.value = '';
//       return;
//     }
//     if (name === 'media_photos' && files.length > 5) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'अधिकतम 5 मीडिया फोटो ही चुन सकते हैं! (Max 5 media images allowed)',
//         text: 'आप एक बार में 5 से ज्यादा मीडिया फोटो अपलोड नहीं कर सकते।',
//       });
//       e.target.value = '';
//       return;
//     }
//     setUpdateForm((prev) => ({ ...prev, [name]: files }));
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('event_id', selectedEvent.id);
//     formData.append('user_id', user.id);
//     formData.append('name', updateForm.name);
//     formData.append('description', updateForm.description);
//     formData.append('start_date_time', updateForm.start_date_time);
//     formData.append('end_date_time', updateForm.end_date_time);
//     formData.append('issue_date', updateForm.issue_date);
//     formData.append('location', updateForm.location);
//     formData.append('attendees', updateForm.attendees);
//     formData.append('type', updateForm.type);
//     if (updateForm.photos) {
//       Array.from(updateForm.photos).forEach(file => formData.append('photos', file));
//     }
//     if (updateForm.video) {
//       formData.append('video', updateForm.video[0]);
//     }
//     if (updateForm.media_photos) {
//       Array.from(updateForm.media_photos).forEach(file => formData.append('media_photos', file));
//     }

//     // Show loader
//     Swal.fire({
//       title: language === 'hi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...',
//       allowOutsideClick: false,
//       didOpen: () => {
//         Swal.showLoading();
//       }
//     });

//     try {
//       const response = await fetch(`${apiUrl}/api/event_update`, {
//         method: 'POST',
//         body: formData,
//       });
//       if (response.ok) {
//         Swal.fire({
//           icon: 'success',
//           title: language === 'hi' ? 'आयोजन अपडेट सफल' : 'Event updated successfully',
//           showConfirmButton: false,
//           timer: 1500
//         });
//         setModalType(null);

//         // Update the event in the events list to set userHasUpdated: true
//         setEvents(prevEvents =>
//           prevEvents.map(ev =>
//             ev.id === selectedEvent.id ? { ...ev, userHasUpdated: true } : ev
//           )
//         );
//       } else {
//         const data = await response.json();
//         if (data && data.error && data.error.includes('5 बार')) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Update Limit',
//             text: data.error,
//           });
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: language === 'hi' ? 'आयोजन अपडेट विफल' : 'Failed to update event',
//             showConfirmButton: false,
//             timer: 1500
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Update error:', error);
//       Swal.fire({
//         icon: 'error',
//         title: language === 'hi' ? 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'An error occurred. Please try again.',
//         showConfirmButton: false,
//         timer: 2000
//       });
//     }
//   };

//    return (
//   <div className="user-panel">
//     <div className="user-stats">
//       <div>{t.lastVisit} {lastVisit}</div>
//       <div>{t.monthlyCount} {monthlyCount}</div>
//     </div>

//     <div className="event-type-toggle">
//       <div className="radio-group">
//         <label>
//           <input
//             type="radio"
//             checked={eventType === 'ongoing'}
//             onChange={() => setEventType('ongoing')}
//           />
//           {t.ongoing}
//         </label>
//         <label>
//           <input
//             type="radio"
//             checked={eventType === 'previous'}
//             onChange={() => setEventType('previous')}
//           />
//           {t.previous}
//         </label>
//       </div>

//     </div>

//     {eventType === 'previous' && (
//       <div className="warning-message">
//         {t.cannotUpdate}
//       </div>
//     )}

//     {/* Desktop Table */}
//     <div className="table-container">
//       <table className="events-table">
//         <thead>
//           <tr>
//             <th>{t.sn}</th>
//             <th>{t.eventDetails}</th>
//             <th>{t.action}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {events.length === 0 ? (
//             <tr>
//               <td colSpan={5} className="no-events-message">
//                 {t.noEvents}
//               </td>
//             </tr>
//           ) : (
//             events.map((event, idx) => (
//               <tr key={event.id}>
//                 <td>{idx + 1}</td>
//                 <td>
//                   <a href="#" className="event-name-link" onClick={() => handleShowDetails(event)}>
//                     {event.name}
//                   </a>
//                 </td>
//                 <td>
//                   <div className="action-buttons">
//                     <button
//                       className="admin-btn admin-btn-details"
//                       onClick={() => handleShowDetails(event)}
//                     >
//                       {t.showDetails}
//                     </button>
//                     {eventType !== 'previous' && (
//                       <button
//                         className="admin-btn admin-btn-update"
//                         onClick={() => handleUpdate(event)}
//                       >
//                         {event.userHasUpdated ? 'Edit' : t.update}
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>

//     {/* Existing modals */}
//     {modalType === 'details' && selectedEvent && (
//       <Modal onClose={() => setModalType(null)}>
//         <UserEventDetails
//           event={selectedEvent}
//           onClose={() => setModalType(null)}
//           formatDateTime={formatDateTime}
//           language={language}
//         />
//       </Modal>
//     )}

//     {modalType === 'update' && updateForm && (
//       <Modal onClose={() => setModalType(null)}>
//         <UserEventUpdateForm
//           updateForm={updateForm}
//           setUpdateForm={setUpdateForm}
//           handleFormChange={handleFormChange}
//           handleFileChange={handleFileChange}
//           handleUpdateSubmit={handleUpdateSubmit}
//           eventTypes={eventTypes}
//           language={language}
//         />
//       </Modal>
//     )}
//   </div>
// );
// };

// export default UserPanel;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, BarChart3,Clock3, History } from "lucide-react";
import Modal from "./Modal";
import UserEventDetails from "./UserEventDetails";
import UserEventUpdateForm from "./UserEventUpdateForm";
import Swal from "sweetalert2";

const TEXT = {
  en: {
    lastVisit: "Your last visit:",
    monthlyCount: "Visits this month:",
    ongoing: "Ongoing Events",
    previous: "Previous Events",
    sn: "S. No.",
    eventDetails: "Event Details ",
    eventDate: "Event Date ",
    action: "Action",
    showDetails: "Details",
    update: "Update",
    noEvents: "No events found.",
    cannotUpdate: "Previous event details cannot be updated.",
    updateSuccess: "Event updated successfully",
    updateFailed: "Failed to update event",
    error: "An error occurred. Please try again.",
    startEventDate: "Start Date",
    endEventDate: "End Date",
  },
  hi: {
    lastVisit: "आपकी अंतिम यात्रा:",
    monthlyCount: "इस माह की यात्राएँ:",
    ongoing: "चल रहे आयोजन",
    previous: "पिछले आयोजन",
    sn: "क्रम संख्या",
    eventDetails: "आयोजन विवरण ",
    eventDate: "आयोजन तिथि ",
    action: "कार्रवाई",
    showDetails: "दिखाएं",
    update: "अपडेट करें",
    noEvents: "कोई आयोजन नहीं मिला।",
    cannotUpdate: "पिछले आयोजन का विवरण अपडेट नहीं किया जा सकता।",
    updateSuccess: "आयोजन अपडेट सफल",
    updateFailed: "आयोजन अपडेट विफल",
    error: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    startEventDate: "प्रारंभ तिथि",
    endEventDate: "समाप्ति तिथि",
  },
};

const eventTypes = ["धरना", "बैठक", "बंद", "रैली", "सभा", "गायपान"];

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

const UserPanel = ({ language = "hi" }) => {
  const t = TEXT[language] || TEXT.hi;
  const [eventType, setEventType] = useState("ongoing");
  const [modalType, setModalType] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updateForm, setUpdateForm] = useState(null);
  const [events, setEvents] = useState([]);
  const [lastVisit, setLastVisit] = useState("");
  const [monthlyCount, setMonthlyCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    if (!user || !role) {
      navigate("/", { replace: true });
    } else if (role !== "user") {
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/user_visits/${user.id}`)
      .then((res) => res.json())
      .then((resData) => {
        setLastVisit(
          resData.last_visit
            ? formatDateTime(resData.last_visit).date
            : t.noVisit
        );
        setMonthlyCount(resData.monthly_count || 0);
      })
      .catch((err) => console.error("Error fetching visits:", err));

    fetch(`${apiUrl}/api/events?status=${eventType}&user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, [eventType, user.id, t.noVisit]);

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setModalType("details");

    fetch(`${apiUrl}/api/event_view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: event.id, user_id: user.id }),
    })
      .then(() => console.log("Event marked as viewed"))
      .catch((err) => console.error("Error marking view:", err));
  };

  const handleUpdate = async (event) => {
    setSelectedEvent(event);
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await fetch(
        `${apiUrl}/api/event_user_details/${event.id}/${user.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setUpdateForm({
          ...event, // fallback: event object se details
          ...data, // backend data overwrite karega
          photos: data.photos
            ? typeof data.photos === "string"
              ? JSON.parse(data.photos)
              : data.photos
            : event.photos
            ? typeof event.photos === "string"
              ? JSON.parse(event.photos)
              : event.photos
            : [],
          media_photos: data.media_photos
            ? typeof data.media_photos === "string"
              ? JSON.parse(data.media_photos)
              : data.media_photos
            : event.media_photos
            ? typeof event.media_photos === "string"
              ? JSON.parse(event.media_photos)
              : event.media_photos
            : [],
          video: data.video
            ? Array.isArray(data.video)
              ? data.video
              : [data.video]
            : event.video
            ? Array.isArray(event.video)
              ? event.video
              : [event.video]
            : [],
        });
      } else {
        setUpdateForm({
          ...event,
          photos: event.photos
            ? typeof event.photos === "string"
              ? JSON.parse(event.photos)
              : event.photos
            : [],
          media_photos: event.media_photos
            ? typeof event.media_photos === "string"
              ? JSON.parse(event.media_photos)
              : event.media_photos
            : [],
          video: event.video
            ? Array.isArray(event.video)
              ? event.video
              : [event.video]
            : [],
        });
      }
    } catch {
      setUpdateForm({
        ...event,
        photos: event.photos
          ? typeof event.photos === "string"
            ? JSON.parse(event.photos)
            : event.photos
          : [],
        media_photos: event.media_photos
          ? typeof event.media_photos === "string"
            ? JSON.parse(event.media_photos)
            : event.media_photos
          : [],
        video: event.video
          ? Array.isArray(event.video)
            ? event.video
            : [event.video]
          : [],
      });
    }
    setModalType("update");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
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
        title:
          "अधिकतम 5 मीडिया फोटो ही चुन सकते हैं! (Max 5 media images allowed)",
        text: "आप एक बार में 5 से ज्यादा मीडिया फोटो अपलोड नहीं कर सकते।",
      });
      e.target.value = "";
      return;
    }
    setUpdateForm((prev) => ({ ...prev, [name]: files }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("event_id", selectedEvent.id);
    formData.append("user_id", user.id);
    formData.append("name", updateForm.name);
    formData.append("description", updateForm.description);
    formData.append("start_date_time", updateForm.start_date_time);
    formData.append("end_date_time", updateForm.end_date_time);
    formData.append("issue_date", updateForm.issue_date);
    formData.append("location", updateForm.location);
    formData.append("attendees", updateForm.attendees);
    formData.append("type", updateForm.type);
    if (updateForm.photos) {
      Array.from(updateForm.photos).forEach((file) =>
        formData.append("photos", file)
      );
    }
    if (updateForm.video) {
      formData.append("video", updateForm.video[0]);
    }
    if (updateForm.media_photos) {
      Array.from(updateForm.media_photos).forEach((file) =>
        formData.append("media_photos", file)
      );
    }

    // Show loader
    Swal.fire({
      title: language === "hi" ? "कृपया प्रतीक्षा करें..." : "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${apiUrl}/api/event_update`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title:
            language === "hi"
              ? "आयोजन अपडेट सफल"
              : "Event updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setModalType(null);

        // Update the event in the events list to set userHasUpdated: true
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev.id === selectedEvent.id ? { ...ev, userHasUpdated: true } : ev
          )
        );
      } else {
        const data = await response.json();
        if (data && data.error && data.error.includes("5 बार")) {
          Swal.fire({
            icon: "error",
            title: "Update Limit",
            text: data.error,
          });
        } else {
          Swal.fire({
            icon: "error",
            title:
              language === "hi" ? "आयोजन अपडेट विफल" : "Failed to update event",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title:
          language === "hi"
            ? "एक त्रुटि हुई। कृपया पुनः प्रयास करें।"
            : "An error occurred. Please try again.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Info Section */}
        <div className="bg-white shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                {t.lastVisit}
              </span>
              <span className="text-sm text-gray-900 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                {lastVisit}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                {t.monthlyCount}
              </span>
              <span className="text-sm text-gray-900 font-semibold bg-green-100 px-2 py-1 rounded-full">
                {monthlyCount}
              </span>
            </div>
          </div>
        </div>
        {/* Filter Section */}
        
        <div className="bg-white shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <label
              className={`flex items-center px-4 py-2 rounded-full border cursor-pointer transition ${
                eventType === "ongoing"
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                checked={eventType === "ongoing"}
                onChange={() => setEventType("ongoing")}
                className="hidden"
              />
              <Clock3 className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{t.ongoing}</span>
            </label>

            <label
              className={`flex items-center px-4 py-2 rounded-full border cursor-pointer transition ${
                eventType === "previous"
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                checked={eventType === "previous"}
                onChange={() => setEventType("previous")}
                className="hidden"
              />
              <History className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{t.previous}</span>
            </label>
          </div>
        </div>
        {/* Warning Message for Previous Events */}
        {eventType === "previous" && (
          <div className="bg-orange-50 border border-orange-200 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-orange-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-800 font-medium">
                  {t.cannotUpdate}
                </p>
              </div>
            </div>
          </div>
        )}
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
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-12 text-center">
                      <div className="text-gray-500 text-lg font-medium mb-2">
                        {t.noEvents}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Try adjusting your filter
                      </div>
                    </td>
                  </tr>
                ) : (
                  events.map((event, idx) => (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          className="text-sm text-orange-600 hover:text-orange-800 font-medium hover:underline focus:outline-none"
                          onClick={() => handleShowDetails(event)}
                        >
                          {event.name}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button
                            className="bg-gray-800 hover:bg-black text-white text-sm font-medium px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            onClick={() => handleShowDetails(event)}
                          >
                            {t.showDetails}
                          </button>
                          {eventType !== "previous" && (
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                              onClick={() => handleUpdate(event)}
                            >
                              {event.userHasUpdated ? "Edit" : t.update}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modals */}
        {modalType === "details" && selectedEvent && (
          <Modal onClose={() => setModalType(null)}>
            <UserEventDetails
              event={selectedEvent}
              onClose={() => setModalType(null)}
              formatDateTime={formatDateTime}
              language={language}
            />
          </Modal>
        )}
        {modalType === "update" && updateForm && (
          <Modal onClose={() => setModalType(null)}>
            <UserEventUpdateForm
              updateForm={updateForm}
              setUpdateForm={setUpdateForm}
              handleFormChange={handleFormChange}
              handleFileChange={handleFileChange}
              handleUpdateSubmit={handleUpdateSubmit}
              eventTypes={eventTypes}
              language={language}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
