import React, { createContext, useEffect, useState } from 'react';

// Create the context
export const DateTimeContext = createContext();

// Helper function to get IST and format
const getFormattedISTDateTime = () => {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    hour12: false,
  };
  const istDate = new Date(now.toLocaleString('en-US', options));

  const dd = String(istDate.getDate()).padStart(2, '0');
  const mm = String(istDate.getMonth() + 1).padStart(2, '0');
  const yyyy = istDate.getFullYear();

  const hours = String(istDate.getHours()).padStart(2, '0');
  const minutes = String(istDate.getMinutes()).padStart(2, '0');

  return `${dd}-${mm}-${yyyy} ${hours}:${minutes}`;
};

// Create a provider component
export const DateTimeProvider = ({ children }) => {
  const [dateTime, setDateTime] = useState(getFormattedISTDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getFormattedISTDateTime());
    }, 60000); // update every 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <DateTimeContext.Provider value={dateTime}>
      {children}
    </DateTimeContext.Provider>
  );
};
