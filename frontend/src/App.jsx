import React, { useState } from "react";
import FirstPage from "./FirstPage";
import LanguagePage from "./LanguagePage";
import Login from "./LoginPage/Login";
import Admin from "./adminpanel/Admin";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import UserPanel from "./userpanel/userpanel";
import Header from "./Header";
import Home from "./Home";

function AppContent() {
  const [step, setStep] = useState(1); // 1: FirstPage, 2: LanguagePage, 3: LoginPage
  const [language, setLanguage] = useState("en"); // 'en' or 'hi'
  const location = useLocation();

  // FirstPage → LanguagePage
  if (step === 1) {
    return (
      <FirstPage
        onStart={() => setStep(2)}
      />
    );
  }

  // LanguagePage → LoginPage
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

  // If on login page, show only Login (no header/background)
  if (location.pathname === "/") {
    return <Login language={language} />;
  }

  // For all other routes, show header and routes
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
