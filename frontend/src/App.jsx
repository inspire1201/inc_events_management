
import React, { useState, useEffect } from "react";
import FirstPage from "./FirstPage";
import LanguagePage from "./LanguagePage";
import Login from "./LoginPage/Login";
import Admin from "./adminpanel/Admin";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import UserPanel from "./userpanel/userpanel";
import Header from "./Header";
import Home from "./Home";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
  const SESSION_KEY = "app_session_active";

  if (!sessionStorage.getItem(SESSION_KEY)) {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }

  sessionStorage.setItem(SESSION_KEY, "true");
}, []);


  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("appStep");
    return savedStep ? Number(savedStep) : 1;
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("appStep", step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  if (step === 1) {
    return <FirstPage onStart={() => setStep(2)} />;
  }

  if (step === 2) {
    return (
      <LanguagePage
        onSelectLanguage={(lang) => {
          setLanguage(lang);
          setStep(3);
        }}
        onCancel={() => setStep(1)}
      />
    );
  }

  if (location.pathname === "/") {
    return <Login language={language} />;
  }

  return (
    <>
      <Header language={language} setLanguage={setLanguage} />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin language={language} />} />
        <Route path="/userpanel" element={<UserPanel language={language} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
