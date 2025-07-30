import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "./assets/download.png";
import vector from "./assets/Vector.svg";
import { Home, UserSquare, ShieldCheck, Menu, X } from "lucide-react";

function Header({ language, setLanguage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!role) return null;

  return (
    <>
      <header className="w-full flex justify-between items-center bg-white px-4 lg:px-6 py-4 shadow-lg border-b-2 border-gray-200 fixed top-0 left-0 right-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-8 lg:h-10 w-auto" />
        </div>

        {/* Desktop Navigation and Actions */}
        <div className="hidden md:!flex items-center justify-between flex-1 ml-8">
          <nav className="flex gap-6 xl:gap-8 items-center">
            <Link
              to="/home"
              className="text-gray-800 hover:text-black font-semibold transition-colors duration-200 flex items-center gap-2 px-3 py-2 border-b-2 border-transparent hover:border-black"
            >
              <Home className="w-5 h-5" />
              {texts[language].home}
            </Link>

            {role === "user" && (
              <Link
                to="/userpanel"
                className="text-gray-800 hover:text-black font-semibold transition-colors duration-200 flex items-center gap-2 px-3 py-2 border-b-2 border-transparent hover:border-black"
              >
                <UserSquare className="w-5 h-5" />
                {texts[language].userPanel}
              </Link>
            )}
            {role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-800 hover:text-black font-semibold transition-colors duration-200 flex items-center gap-2 px-3 py-2 border-b-2 border-transparent hover:border-black"
              >
                <ShieldCheck className="w-5 h-5" />
                {texts[language].adminPanel}
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLanguageToggle}
              title={texts[language].switch}
              className="p-2 border border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-200"
            >
              <img src={vector} alt="Language Toggle" className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200 border border-red-600"
            >
              {texts[language].logout}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-gray-800 hover:text-black transition-colors duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l-2 border-gray-200 z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-black">Menu</h2>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-800 hover:text-black transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-4">
            <Link
              to="/home"
              onClick={toggleMobileMenu}
              className="flex items-center gap-3 text-gray-800 hover:text-black font-semibold transition-colors duration-200 p-3 border-b border-gray-200 hover:bg-gray-50"
            >
              <Home className="w-5 h-5" />
              {texts[language].home}
            </Link>

            {role === "user" && (
              <Link
                to="/userpanel"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 text-gray-800 hover:text-black font-semibold transition-colors duration-200 p-3 border-b border-gray-200 hover:bg-gray-50"
              >
                <UserSquare className="w-5 h-5" />
                {texts[language].userPanel}
              </Link>
            )}

            {role === "admin" && (
              <Link
                to="/admin"
                onClick={toggleMobileMenu}
                className="flex items-center gap-3 text-gray-800 hover:text-black font-semibold transition-colors duration-200 p-3 border-b border-gray-200 hover:bg-gray-50"
              >
                <ShieldCheck className="w-5 h-5" />
                {texts[language].adminPanel}
              </Link>
            )}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-3 w-full text-left text-gray-800 hover:text-black font-semibold transition-colors duration-200 p-3 hover:bg-gray-50"
            >
              <img src={vector} alt="Language Toggle" className="h-5 w-5" />
              {texts[language].switch}
            </button>

            <button
              onClick={() => {
                toggleMobileMenu();
                handleLogout();
              }}
              className="w-full px-6 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200 border border-red-600"
            >
              {texts[language].logout}
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-20 lg:mt-24 text-center px-4">
        {userName && (
          <p className="text-lg lg:text-xl font-semibold text-gray-700">
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
