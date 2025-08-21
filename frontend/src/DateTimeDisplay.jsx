// import React, { useState, useEffect } from 'react';

// function DateTimeDisplay() {
//   const [currentDateTime, setCurrentDateTime] = useState(new Date());

//   // Update the time every second
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(interval); // Cleanup
//   }, []);

//   // Format the date and time
//   const formattedDate = currentDateTime.toLocaleDateString();
//   const formattedTime = currentDateTime.toLocaleTimeString();
//   const formattedDateForInput = currentDateTime.toISOString().split('T')[0]; // YYYY-MM-DD


//   return (
//     <div>
//       <h2>Today's Date: {formattedDate}</h2>
//       <h2>Current Time: {formattedTime}</h2>
//       <h2>formatt date : {formattedDateForInput}</h2>
//     </div>
//   );
// }

// export default DateTimeDisplay;
import React, { useState, useEffect } from 'react';

function DateTimeForm() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update every second (real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format for <input type="datetime-local">
  const formatForDateTimeLocal = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formattedDateTime = formatForDateTimeLocal(currentDateTime);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Submitted DateTime:', formData.get('issue_datetime'));
    // You can send it to backend using fetch/axios
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <label className="block">
        <span className="text-gray-700">Current Date & Time:</span>
        <input
          type="datetime-local"
          name="issue_datetime"
          value={formattedDateTime}
          readOnly
          required
          className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-700 rounded-md"
        />
      </label>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}

export default DateTimeForm;
