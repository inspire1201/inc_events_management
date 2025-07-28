import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './admin.css';
import Modal from './Modal.jsx';
import AddEventForm from './AddEventForm.jsx';
import EventReport from './EventReport.jsx';
import UserDetailModal from './UserDetailModal.jsx';
import { useNavigate } from "react-router-dom";

const TEXT = {
  en: {
    lastVisit: 'Your last visit:',
    monthlyCount: 'Visits this month:',
    ongoing: 'Ongoing Events',
    previous: 'Previous Events',
    addEvent: 'Add Event',
    sn: 'S.no',
    eventDetails: 'Event Details',
    startDate: 'Start Date',
    endDate: 'End Date',
    action: 'Action',
    showReport: 'Report',
    noVisit: 'No visit',
    eventAdded: 'Event added successfully!',
    eventAddFailed: 'Failed to add event. Please try again.',
    error: 'An error occurred. Please try again.',
    addingEvent: 'Adding Event...',
    pleaseWait: 'Please wait while we add your event',
    report: 'Report',
    close: 'Close',
  },
  hi: {
    lastVisit: 'आपकी अंतिम यात्रा:',
    monthlyCount: 'इस माह की यात्राएँ:',
    ongoing: 'चल रहे आयोजन',
    previous: 'पिछले आयोजन',
    addEvent: 'आयोजन जोड़ें',
    sn: 'क्र.सं',
    eventDetails: 'आयोजन विवरण ',
    startDate: 'प्रारंभ तिथि',
    endDate: 'समाप्ति तिथि',
    action: 'कार्रवाई',
    showReport: 'रिपोर्ट दिखाएं',
    noVisit: 'कोई यात्रा नहीं',
    eventAdded: 'आयोजन सफलतापूर्वक जोड़ा गया!',
    eventAddFailed: 'आयोजन जोड़ना विफल। कृपया पुनः प्रयास करें।',
    error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    addingEvent: 'आयोजन जोड़ रहे हैं...',
    pleaseWait: 'कृपया प्रतीक्षा करें जबकि हम आपका आयोजन जोड़ रहे हैं',
    report: 'रिपोर्ट',
    close: 'बंद करें',
  },
};

const eventTypes = ['धरना', 'बैठक', 'बंद', 'रैली', 'सभा', 'गायपान'];
const users = ['All Jila Addhyaksh'];

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes} ${ampm}`,
  };
};

const Admin = ({ language = 'hi' }) => {
  const t = TEXT[language] || TEXT.hi;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReport, setShowReport] = useState(null);
  const [filter, setFilter] = useState('ongoing');
  const [events, setEvents] = useState([]);
  const [userDetailModal, setUserDetailModal] = useState(null);
  const [lastVisit, setLastVisit] = useState('');
  const [monthlyCount, setMonthlyCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
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

  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format
  const [form, setForm] = useState({
    name: '',
    description: '',
    start_date_time: '',
    end_date_time: '',
    issue_date: today, // ab yahan aaj ki date aa jayegi
    type: eventTypes[0],
    user: users[0],
    location: '',
    photos: null
  });
 
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/user_visits/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setLastVisit(data.last_visit ? formatDateTime(data.last_visit).date : t.noVisit);
        setMonthlyCount(data.monthly_count || 0);
      })
      .catch(err => console.error('Error fetching visits:', err));

    fetch(`${apiUrl}/api/events?status=${filter}`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error fetching events:', err));
  }, [filter, user.id, t.noVisit]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'photos') {
      if (files.length > 10) {
        Swal.fire({
          icon: 'warning',
          title: 'Maximum 10 images allowed',
          text: 'आप एक बार में 10 से ज्यादा फोटो अपलोड नहीं कर सकते। You cannot upload more than 10 photos at once.',
        });
        e.target.value = '';
        return;
      }
    }
    setForm((prev) => ({ ...prev, [name]: files }));
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
    
    // Show loading state
    Swal.fire({
      title: t.addingEvent,
      text: t.pleaseWait,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'photos' && value) {
        Array.from(value).forEach(file => formData.append('photos', file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch(`${apiUrl}/api/event_add`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: t.eventAdded,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          setShowAddModal(false);
        });
        setForm({
          name: '',
          description: '',
          start_date_time: '',
          end_date_time: '',
          issue_date: today, // reset karte waqt bhi aaj ki date
          type: eventTypes[0],
          user: users[0],
          location: '',
          photos: null
        });
        fetch(`${apiUrl}/api/events?status=${filter}`)
          .then(res => res.json())
          .then(data => setEvents(data));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: t.eventAddFailed,
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Add event error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: t.error,
        confirmButtonText: 'OK'
      });
    }
  };

  const handleShowReport = (event) => {
    fetch(`${apiUrl}/api/event_report/${event.id}`)
      .then(res => res.json())
      .then(data => setShowReport({ ...event, users: data.users, event: data.event }))
      .catch(err => console.error('Error fetching report:', err));
  };

  const handleShowUserDetails = (event_id, user) => {
    fetch(`${apiUrl}/api/event_user_details/${event_id}/${user.ID}`)
      .then(res => res.json())
      .then(data => setUserDetailModal({ ...user, details: data }))
      .catch(err => console.error('Error fetching user details:', err));
  };

  // Helper to reset form
  const resetForm = () => setForm({
    name: '',
    description: '',
    start_date_time: '',
    end_date_time: '',
    issue_date: today,
    type: eventTypes[0],
    user: users[0],
    location: '',
    photos: null,
  });

  // Helper: Convert File to base64
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Helper: Convert base64 to File
  const base64ToFile = (base64, filename, mimeType) => {
    const arr = base64.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mimeType });
  };

  // Helper to refresh drafts from localStorage
  const refreshDrafts = () => {
    const allDrafts = JSON.parse(localStorage.getItem('eventFormDrafts') || '[]');
    setDrafts(allDrafts);
  };

  // Call refreshDrafts on mount
  useEffect(() => {
    refreshDrafts();
  }, []);

  // Update refreshDrafts after saving or deleting draft
  const saveDraft = async () => {
    let photosBase64 = null;
    let videoBase64 = null;
    if (form.photos) {
      photosBase64 = await Promise.all(Array.from(form.photos).map(fileToBase64));
    }
    if (form.video) {
      const videoFile = form.video[0];
      if (videoFile) {
        if (videoFile.size > 4 * 1024 * 1024) {
          Swal.fire({
            icon: 'warning',
            title: 'Video too large for draft',
            text: 'वीडियो बहुत बड़ा है, ड्राफ्ट में सेव नहीं किया जाएगा। Video is too large to save in draft.'
          });
        } else {
          videoBase64 = [await fileToBase64(videoFile)];
        }
      }
    }
    let draftsArr = JSON.parse(localStorage.getItem('eventFormDrafts') || '[]');
    if (loadedDraftId !== null) {
      // Update existing draft
      draftsArr = draftsArr.map(d => d.id === loadedDraftId ? {
        ...d,
        name: form.name || (language === 'hi' ? 'कोई नाम नहीं' : 'No Name'),
        savedAt: new Date().toISOString(),
        data: { ...form, photos: photosBase64, video: videoBase64 }
      } : d);
      Swal.fire({
        icon: 'success',
        title: language === 'hi' ? 'ड्राफ्ट अपडेट हुआ!' : 'Draft Updated!',
        timer: 1200,
        showConfirmButton: false
      });
    } else {
      // Add new draft
      draftsArr.push({
        id: Date.now(),
        name: form.name || (language === 'hi' ? 'कोई नाम नहीं' : 'No Name'),
        savedAt: new Date().toISOString(),
        data: { ...form, photos: photosBase64, video: videoBase64 }
      });
      Swal.fire({
        icon: 'success',
        title: language === 'hi' ? 'ड्राफ्ट सेव हो गया!' : 'Draft Saved!',
        timer: 1200,
        showConfirmButton: false
      });
    }
    localStorage.setItem('eventFormDrafts', JSON.stringify(draftsArr));
    refreshDrafts();
    setShowDrafts(false); // Close popup after save
    setLoadedDraftId(null); // Reset loaded draft after save
  };

  // Load a draft by id (for now, load the latest draft)
  const loadDraft = async (draftId = null) => {
    let drafts = JSON.parse(localStorage.getItem('eventFormDrafts') || '[]');
    let draft = null;
    if (draftId) {
      draft = drafts.find(d => d.id === draftId);
    } else if (drafts.length > 0) {
      draft = drafts[drafts.length - 1]; // latest
    }
    if (draft) {
      const parsed = draft.data;
      let photosFiles = null;
      let videoFiles = null;
      if (parsed.photos && Array.isArray(parsed.photos)) {
        photosFiles = new DataTransfer();
        parsed.photos.forEach((b64, idx) => {
          const mime = b64.substring(b64.indexOf(':') + 1, b64.indexOf(';'));
          const file = base64ToFile(b64, `photo${idx}.${mime.split('/')[1] || 'jpg'}`, mime);
          photosFiles.items.add(file);
        });
        photosFiles = photosFiles.files;
      }
      if (parsed.video && Array.isArray(parsed.video) && parsed.video[0]) {
        const b64 = parsed.video[0];
        const mime = b64.substring(b64.indexOf(':') + 1, b64.indexOf(';'));
        const file = base64ToFile(b64, `video.${mime.split('/')[1] || 'mp4'}`, mime);
        const dt = new DataTransfer();
        dt.items.add(file);
        videoFiles = dt.files;
      }
      setForm({ ...parsed, photos: photosFiles, video: videoFiles });
    } else {
      resetForm();
    }
  };

  // Remove a draft by id
  const removeDraft = (draftId) => {
    let drafts = JSON.parse(localStorage.getItem('eventFormDrafts') || '[]');
    drafts = drafts.filter(d => d.id !== draftId);
    localStorage.setItem('eventFormDrafts', JSON.stringify(drafts));
    Swal.fire({
      icon: 'success',
      title: language === 'hi' ? 'ड्राफ्ट हटाया गया!' : 'Draft Deleted!',
      timer: 1200,
      showConfirmButton: false
    });
    refreshDrafts();
  };

  // SweetAlert Cancel Handler
  const handleCancelAddEvent = () => {
    Swal.fire({
      title: 'Discard changes?',
      text: 'क्या आप फॉर्म को डिस्कार्ड करना चाहते हैं?\nDo you want to discard the form?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Discard',
      denyButtonText: 'Save Draft',
      cancelButtonText: 'Continue Updating',
      customClass: { confirmButton: 'swal2-confirm', denyButton: 'swal2-deny', cancelButton: 'swal2-cancel' },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Discard
        resetForm();
        removeDraft();
        setShowAddModal(false);
      } else if (result.isDenied) {
        // Save Draft
        await saveDraft();
        setShowAddModal(false);
      }
      // else: continue updating (do nothing)
    });
  };

  // When opening AddEventForm, load draft if available
  const handleOpenAddModal = async () => {
    await loadDraft();
    setShowAddModal(true);
    setLoadedDraftId(null);
  };

  // Load and open Add Event modal
  const handleLoadDraft = async (draftId) => {
    await loadDraft(draftId);
    setShowAddModal(true);
    setShowDrafts(false);
    setLoadedDraftId(draftId); // Track which draft is loaded
  };

  return (
    <div className="admin-container">
      
      <div className="admin-header-info" style={{ position: 'relative' }}>
        <div>{t.lastVisit} {lastVisit}</div>
        <div>{t.monthlyCount} {monthlyCount}</div>
      </div>
      <div className='save-draft-btn' style={{ position: 'relative' }}>
        <button onClick={() => setShowDrafts((v) => !v)}>
          {language === 'hi' ? 'ड्राफ्ट' : 'Draft'}
        </button>
        {showDrafts && (
          <div style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            minWidth: 220,
            zIndex: 10,
            padding: 8
          }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              {language === 'hi' ? 'ड्राफ्ट्स' : 'Drafts'}
            </div>
            {drafts.length === 0 ? (
              <div style={{ color: '#888', fontSize: 14 }}>
                {language === 'hi' ? 'कोई ड्राफ्ट नहीं' : 'No drafts'}
              </div>
            ) : (
              drafts.slice().reverse().map((d) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.name} <span style={{ color: '#aaa', fontSize: 11 }}>({new Date(d.savedAt).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US')})</span>
                  </div>
                  <div>
                    <button style={{ marginRight: 4, fontSize: 12, padding: '2px 8px' }} onClick={() => handleLoadDraft(d.id)}>
                      {language === 'hi' ? 'लोड' : 'Load'}
                    </button>
                    <button style={{ fontSize: 12, padding: '2px 8px', color: '#c00' }} onClick={() => removeDraft(d.id)}>
                      {language === 'hi' ? 'हटाएं' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <div className="admin-filter-row">
        <div>
          <label>
            <input
              type="radio"
              checked={filter === 'ongoing'}
              onChange={() => setFilter('ongoing')}
            />{' '}
            {t.ongoing}
          </label>
          <label className="admin-filter-label">
            <input
              type="radio"
              checked={filter === 'previous'}
              onChange={() => setFilter('previous')}
            />{' '}
            {t.previous}
          </label>
        </div>
        <button className="admin-btn" onClick={handleOpenAddModal}>
          {t.addEvent}
        </button>
      </div>
      <table className="admin-table" border="1" width="100%" cellPadding={8}>
        <thead>
          <tr className="admin-table-header">
            <th className="admin-table-th">{t.sn}</th>
            <th className="admin-table-th">{t.eventDetails}</th>
            <th className="admin-table-th">{t.startDate}</th>
            {/* <th className="admin-table-th">{t.endDate}</th> */}
            <th className="admin-table-th">{t.action}</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev, idx) => (
            <tr key={ev.id}>
              <td className="admin-table-td">{idx + 1}</td>
              <td className="admin-table-td">
                <a href="#" className="admin-event-link" onClick={() => handleShowReport(ev)}>
                  {ev.name}
                </a>
              </td>
              <td className="admin-table-td">
                {formatDateTime(ev.start_date_time).date}
                <br/>
                
                 {formatDateTime(ev.start_date_time).time}
              </td>
              {/* <td className="admin-table-td">
                {formatDateTime(ev.end_date_time).date} {formatDateTime(ev.end_date_time).time}
              </td> */}
              <td className="admin-table-td">
                <button className="admin-btn" onClick={() => handleShowReport(ev)}>{t.showReport}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  );
};

export default Admin;