
import React, { useState, useEffect } from "react";
import FirstPage from "./FirstPage";
import LanguagePage from "./LanguagePage";
import Login from "./LoginPage/Login";
import Admin from "./adminpanel/Admin";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import UserPanel from "./userpanel/userpanel";
import Header from "./Header";
import Home from "./Home";
import { useLanguage } from "./context/LanguageContext";

function AppContent() {
  const location = useLocation();
  const { language,setLanguage } = useLanguage();


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



  useEffect(() => {
    localStorage.setItem("appStep", step);
  }, [step]);



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
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/userpanel" element={<UserPanel />} />
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
