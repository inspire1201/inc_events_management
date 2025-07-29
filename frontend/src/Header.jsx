import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "./assets/download.png";
import vector from "./assets/Vector.svg";
import { Home, UserSquare, ShieldCheck } from "lucide-react";

function Header({ language, setLanguage }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.username : "";

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
      confirm: "Yes, logout!",
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
      confirm: "हाँ, लॉगआउट करें!",
    },
  };

  const handleLogout = () => {
    Swal.fire({
      title: texts[language].logoutConfirmTitle,
      text: texts[language].logoutConfirmText,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: texts[language].confirm,
      cancelButtonText: texts[language].cancel,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("role");
        navigate("/");
        Swal.fire(
          "Logged out!",
          "You have been successfully logged out.",
          "success"
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
      <header className="w-full flex justify-between items-center bg-white px-6 py-3 shadow-md fixed top-0 left-0 right-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-10 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex gap-6 items-center">
          <Link
            to="/home"
            className="text-gray-800 hover:text-blue-600 font-medium transition flex items-center gap-1"
          >
            <Home className="w-5 h-5" />
            {texts[language].home}
          </Link>

          {role === "user" && (
            <Link
              to="/userpanel"
              className="text-gray-800 hover:text-blue-600 font-medium transition flex items-center gap-1"
            >
              <UserSquare className="w-5 h-5" />
              {texts[language].userPanel}
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/admin"
              className="text-gray-800 hover:text-blue-600 font-medium transition flex items-center gap-1"
            >
              <ShieldCheck className="w-5 h-5" />
              {texts[language].adminPanel}
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <img
            src={vector}
            alt="Language Toggle"
            onClick={handleLanguageToggle}
            title={texts[language].switch}
            className="h-6 w-6 cursor-pointer hover:scale-110 transition"
          />
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            {texts[language].logout}
          </button>
        </div>
      </header>

      {/* Welcome Message */}
      <div className="mt-20 text-center">
        {userName && (
          <p className="text-xl font-semibold text-gray-700 animate-pulse">
            {language === "hi"
              ? `स्वागत है - ${userName}`
              : `Welcome - ${userName}`}
          </p>
        )}
      </div>
    </>
  );
}

export default Header;
