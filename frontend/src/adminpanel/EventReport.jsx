import React, { useState } from 'react';
import './EventReport.css';
import Modal from './Modal';
import ReactDOMServer from 'react-dom/server';
import PdfExportButton from './PdfExportButton';

const TEXT = {
  en: {
    title: 'Event Report',
    name: 'Event Name:',
    desc: 'Description:',
    start: 'Start Date/Time:',
    end: 'End Date/Time:',
    issue: 'Issue Date:',
    type: 'Event Type:',
    statsViewed: 'users viewed this event',
    statsUpdated: 'users updated details',
    sn: 'S. No.',
    userName: 'User Name',
    designation: 'Designation',
    viewed: 'View', // Table heading ke liye
    seen: 'Seen', // Row value ke liye
    unseen: 'Unseen', // Row value ke liye
    updated: 'Updated',
    notUpdated: 'Not Updated',
    action: 'Action',
    showDetails: 'Details',
  },
  hi: {
    title: 'आयोजन रिपोर्ट',
    name: 'आयोजन का नाम:',
    desc: 'विवरण:',
    start: 'प्रारंभ तिथि/समय:',
    end: 'समाप्ति तिथि/समय:',
    issue: 'जारी करने की तिथि:',
    type: 'आयोजन का प्रकार:',
    statsViewed: 'में से उपयोगकर्ताओं ने इस आयोजन को देखा',
    statsUpdated: 'में से उपयोगकर्ताओं ने विवरण अपडेट किया',
    sn: 'क्रम संख्या',
    userName: 'उपयोगकर्ता का नाम',
    designation: 'पदनाम',
    viewed: 'View', // Table heading ke liye
    seen: 'देखा गया', // Row value ke liye
    unseen: 'नहीं देखा गया', // Row value ke liye
    updated: 'अपडेट किया गया',
    notUpdated: 'नहीं अपडेट किया गया',
    action: 'कार्रवाई',
    showDetails: 'विवरण ',
  },
};

const EventReport = ({ showReport, onClose, handleShowUserDetails, formatDateTime, language = 'hi' }) => {
  const [filter, setFilter] = useState('all');
  const t = TEXT[language] || TEXT.hi;
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  // Aspect ratio state for collage
  const [ratios, setRatios] = React.useState([]);
  React.useEffect(() => {
    let photosArr = [];
    const photosRaw = showReport.event.photos;
    if (photosRaw) {
      if (Array.isArray(photosRaw)) {
        photosArr = photosRaw;
      } else if (typeof photosRaw === 'string') {
        try {
          const parsed = JSON.parse(photosRaw);
          if (Array.isArray(parsed)) {
            photosArr = parsed;
          } else if (typeof parsed === 'string') {
            photosArr = [parsed];
          } else {
            photosArr = photosRaw.split(',').map(s => s.trim()).filter(Boolean);
          }
        } catch {
          photosArr = photosRaw.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }
    photosArr = photosArr.filter(p => !!p && typeof p === 'string');
    if (photosArr.length > 1) {
      let loaded = 0;
      const tempRatios = Array(photosArr.length).fill(1);
      photosArr.forEach((photo, idx) => {
        const img = new window.Image();
        img.onload = function() {
          tempRatios[idx] = img.naturalWidth / img.naturalHeight;
          loaded++;
          if (loaded === photosArr.length) {
            setRatios([...tempRatios]);
          }
        };
        img.onerror = function() {
          loaded++;
          if (loaded === photosArr.length) {
            setRatios([...tempRatios]);
          }
        };
        img.src = photo.startsWith('http') ? photo : `${apiUrl}${photo}`;
      });
    } else {
      setRatios([]);
    }
  }, [showReport.event.photos]);

  // Filtered users logic
  const filteredUsers = showReport.users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'viewed') return user.viewed > 0;
    if (filter === 'notViewed') return user.viewed === 0;
    if (filter === 'updated') return user.updated > 0;
    if (filter === 'notUpdated') return user.updated === 0;
    return true;
  });

  return (
    <Modal onClose={onClose}>
      <div className="event-report-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{t.title}</h3>
        </div>
        {/* PDF content wrapper start */}
        <div id="event-report-pdf-section">
          {/* Remove inline PDF style, now handled by PdfExportButton */}
          <div className="event-details-box">
            <div><b>{t.name}</b> {showReport.event.name}</div>
            <div><b>{t.desc}</b> {showReport.event.description}</div>
            <div><b>{t.start}</b> {formatDateTime(showReport.event.start_date_time).date} {formatDateTime(showReport.event.start_date_time).time}</div>
            <div><b>{t.end}</b> {formatDateTime(showReport.event.end_date_time).date} {formatDateTime(showReport.event.end_date_time).time}</div>
            <div><b>{t.issue}</b> {formatDateTime(showReport.event.issue_date).date}</div>
            <div><b>{t.type}</b> {showReport.event.type}</div>
          </div>
          <div className="event-media-section">
            <h3>Photo Covers</h3>
            {/* Photos */}
            {(() => {
              let photosArr = [];
              const photosRaw = showReport.event.photos;
              if (photosRaw) {
                if (Array.isArray(photosRaw)) {
                  photosArr = photosRaw;
                } else if (typeof photosRaw === 'string') {
                  // Try JSON parse
                  try {
                    const parsed = JSON.parse(photosRaw);
                    if (Array.isArray(parsed)) {
                      photosArr = parsed;
                    } else if (typeof parsed === 'string') {
                      photosArr = [parsed];
                    } else {
                      // Fallback: comma separated
                      photosArr = photosRaw.split(',').map(s => s.trim()).filter(Boolean);
                    }
                  } catch {
                    // Not JSON, try comma separated
                    photosArr = photosRaw.split(',').map(s => s.trim()).filter(Boolean);
                  }
                }
              }
              // Remove empty/invalid
              photosArr = photosArr.filter(p => !!p && typeof p === 'string');
              if (photosArr.length === 1) {
                return (
                  <div className="event-photos collage-single" style={{border:'1px solid #eee', minHeight:'120px'}}>
                    <div className="collage-photo" style={{width:'100%', height:'100%', borderRadius:'8px', overflow:'hidden'}}>
                      <img
                        src={photosArr[0].startsWith('http') ? photosArr[0] : `${apiUrl}${photosArr[0]}`}
                        alt="Photo"
                        style={{width:'100%', height:'100%', objectFit:'cover'}}
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>
                );
              } else if (photosArr.length > 1) {
                return (
                  <div className="event-photos collage-flex" style={{border:'1px solid #eee', minHeight:'120px'}}>
                    {photosArr.map((photo, idx) => (
                      <div
                        key={idx}
                        className="collage-photo"
                        style={{
                          flex: `${ratios[idx] || 1} 1 0%`,
                          aspectRatio: ratios[idx] ? `${ratios[idx]}` : '1/1',
                          borderRadius:'8px',
                          overflow:'hidden',
                          minWidth:'80px',
                          maxWidth:'100%'
                        }}
                      >
                        <img
                          src={photo.startsWith('http') ? photo : `${apiUrl}${photo}`}
                          alt="Photo"
                          style={{width:'100%', height:'100%', objectFit:'cover'}}
                          crossOrigin="anonymous"
                        />
                      </div>
                    ))}
                  </div>
                );
              } else {
                return <div style={{textAlign:'center',color:'#aaa',fontSize:'16px'}}>No photos available / कोई फोटो नहीं</div>;
              }
            })()}
            {/* Video */}
            {showReport.event.video && (
              <div className="event-video-wrapper">
                <video
                  controls
                  src={showReport.event.video.startsWith('http') ? showReport.event.video : `${apiUrl}${showReport.event.video}`}
                  className="event-video"
                />
              </div>
            )}
          </div>
          <div className="event-stats-box">
            <div className="event-stats">
              {showReport.users.length} {t.statsViewed} {showReport.users.filter(u => u.viewed > 0).length} / {showReport.users.length} |{' '}
              {showReport.users.length} {t.statsUpdated} {showReport.users.filter(u => u.updated > 0).length} / {showReport.users.length}
            </div>
          </div>
          <div className='dropdwon pdf-hide'>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
              <div>
                <PdfExportButton targetId="event-report-pdf-section" filename="event-report.pdf" />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px' }}>
                <option value="all">All</option>
                <option value="viewed">Viewed</option>
                <option value="notViewed">Not Viewed</option>
                <option value="updated">Updated</option>
                <option value="notUpdated">Not Updated</option>
              </select>
            </div>
          </div>
          <div className="event-report-table-wrapper">
            <table className="event-report-table">
              <thead>
                <tr>
                  <th>{t.sn}</th>
                  <th>{t.userName}</th>
                  <th>{t.designation}</th>
                  <th>{t.viewed}</th>
                  <th>{t.updated}</th>
                  <th className="pdf-action-col">{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={user.ID}>
                    <td>{idx + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.designation}</td>
                    <td>
                      <span style={{ color: user.viewed > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                        {user.viewed > 0 ? t.seen : t.unseen}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: user.updated > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                        {user.updated > 0 ? t.updated : t.notUpdated}
                      </span>
                    </td>
                    <td className="pdf-action-col">
                      <button onClick={() => handleShowUserDetails(showReport.event.id, user)}>{t.showDetails}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* PDF content wrapper end */}
        </div>
      </div>
    </Modal>
  );
};

export default EventReport; 