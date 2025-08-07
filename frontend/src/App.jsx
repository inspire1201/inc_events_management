import React, { useState } from "react";
import FirstPage from "./FirstPage";
import LanguagePage from "./LanguagePage";
import Login from "./LoginPage/Login";
import Admin from "./adminpanel/Admin";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import UserPanel from "./userpanel/userpanel";
import Header from "./Header";
import Home from "./Home";
import AllUsersSummary from "./userpanel/AllUsersSummary";
import UserVisits from "./userpanel/UserVisits";

function AppContent() {
  const [step, setStep] = useState(1); 
  const [language, setLanguage] = useState("en"); 
  const location = useLocation();

  if (step === 1) {
    return (
      <FirstPage
        onStart={() => setStep(2)}
      />
    );
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
