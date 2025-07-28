import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "./assets/download.png";
import "./Header.css";
import vector  from './assets/Vector.svg';

function Header({ language, setLanguage }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "user" ya "admin"
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.username : "";

  // Texts for both languages
  const texts = {
    en: {
      home: "Home",
      userPanel: "User Panel",
      adminPanel: "Admin Panel",
      logout: "Logout",
      switch: "Switch to Hindi",
      logoutConfirmTitle: "Are you sure?",
      logoutConfirmText: "Do you want to logout?",
      cancel: "Cancel",
      confirm: "Yes, logout!"
    },
    hi: {
      home: "होम",
      userPanel: "यूज़र पैनल",
      adminPanel: "एडमिन पैनल",
      logout: "लॉगआउट",
      switch: "अंग्रेज़ी में बदलें",
      logoutConfirmTitle: "क्या आप सुनिश्चित हैं?",
      logoutConfirmText: "क्या आप लॉगआउट करना चाहते हैं?",
      cancel: "रद्द करें",
      confirm: "हाँ, लॉगआउट करें!"
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: texts[language].logoutConfirmTitle,
      text: texts[language].logoutConfirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: texts[language].confirm,
      cancelButtonText: texts[language].cancel
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("role");
        navigate("/");
        Swal.fire(
          'Logged out!',
          'You have been successfully logged out.',
          'success'
        );
      }
    });
  };

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  if (!role) return null;

  return (
    <>
    <header className="header-container">
      <img src={logo} alt="logo" className="header-logo" />
     
     
      <Link to="/home" className="header-link">{texts[language].home}</Link>
      {role === "user" && <Link to="/userpanel" className="header-link">{texts[language].userPanel}</Link>}
      {role === "admin" && <Link to="/admin" className="header-link">{texts[language].adminPanel}</Link>}
      <div className="header-actions">
        <img
          src={vector}
          alt="vector"
          className="header-vector"
          onClick={handleLanguageToggle}
          title={texts[language].switch}
          style={{ cursor: "pointer" }}
        />
        <button onClick={handleLogout} className="header-logout">{texts[language].logout}</button>
      </div>
    </header>
    <div className="header-welcome">
      {userName && (
          <div className="animated-text " >
            {language === 'hi' ? `स्वागत है - ${userName}` : `Welcome - ${userName}`}
          </div>
        )}
        </div>

      </>
  );
}

export default Header; 