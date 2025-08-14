import React, { createContext, useState, useEffect, useContext } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <LanguageContext.Provider value={{ language, handleLanguageToggle ,setLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};