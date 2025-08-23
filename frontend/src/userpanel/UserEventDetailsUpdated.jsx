import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const UserEventDetailsUpdated = ({ user, event_id, apiUrl }) => {
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (!user || !event_id) return;

    fetch(`${apiUrl}/api/event_user_details/${event_id}/${user.ID}`)
      .then((res) => res.json())
      .then((data) => setUserDetail({ ...user, details: data }))
      .catch((err) => console.error("Error fetching user details:", err));
  }, [user, event_id, apiUrl]);

  if (!userDetail) {
    return <div>Loading details...</div>;
  }

  const API_URL = apiUrl;

  const renderPhotos = (photos) => {
    if (!photos || photos.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-3 mt-2">
        {photos.map((photo, idx) => (
          <img
            key={idx}
            src={photo.startsWith("http") ? photo : `${API_URL}${photo}`}
            alt="Photo"
            className="w-28 h-20 sm:w-24 sm:h-16 object-cover rounded-md border-2 border-gray-200 shadow-md"
          />
        ))}
      </div>
    );
  };

  const renderLinks = (links, isVideo = false) => {
    if (!links) return null;
    const label = isVideo ? "Video Link" : "Other URL";
    const colorClass = isVideo
      ? "bg-indigo-600 hover:bg-gradient-to-r from-purple-700 to-indigo-500"
      : "bg-green-600 hover:bg-gradient-to-r from-green-700 to-teal-500";
    const arrLinks = Array.isArray(links) ? links : [links];

    return (
      <div className="flex flex-wrap gap-3 mt-2">
        {arrLinks.map((url, idx) => (
          <a
            key={idx}
            href={url.startsWith("http") ? url : `${API_URL}${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white font-semibold px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all ${colorClass}`}
          >
            {label} {idx + 1}
          </a>
        ))}
      </div>
    );
  };

  const details = userDetail.details;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Your Event Details
      </h2>

      <div>
        <b className="text-purple-700">Name: </b> {userDetail.name}
      </div>
      <div>
        <b className="text-purple-700">Designation: </b> {userDetail.designation}
      </div>

      {details && (
        <>
          <div>
            <b className="text-purple-700">Event Name: </b> {details.name}
          </div>
          <div>
            <b className="text-purple-700">Description: </b> {details.description}
          </div>
          <div>
            <b className="text-purple-700">Start Date/Time: </b>{" "}
            {new Date(details.start_date_time).toLocaleString()}
          </div>
          <div>
            <b className="text-purple-700">End Date/Time: </b>{" "}
            {new Date(details.end_date_time).toLocaleString()}
          </div>
          <div>
            <b className="text-purple-700">Location: </b> {details.location}
          </div>
          <div>
            <b className="text-purple-700">Attendees: </b> {details.attendees}
          </div>
          <div>
            <b className="text-purple-700">Event Type: </b> {details.type}
          </div>

          {/* Photos */}
          {renderPhotos(
            details.photos ? (Array.isArray(details.photos) ? details.photos : JSON.parse(details.photos)) : []
          )}

          {/* Media Video URLs */}
          {renderLinks(
            details.media_video_urls
              ? Array.isArray(details.media_video_urls)
                ? details.media_video_urls
                : [details.media_video_urls]
              : [],
            true
          )}

          {/* Media Other URLs */}
          {renderLinks(
            details.media_other_urls
              ? Array.isArray(details.media_other_urls)
                ? details.media_other_urls
                : [details.media_other_urls]
              : [],
            false
          )}
        </>
      )}
    </div>
  );
};

export default UserEventDetailsUpdated;
