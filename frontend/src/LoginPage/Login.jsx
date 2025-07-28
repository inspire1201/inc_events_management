import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./login.css";

const TEXT = {
  en: {
    title: "Indian National Congress",
    login: "Login",
    pinLabel: "4-Digit PIN",
    pinPlaceholder: "****",
    loginBtn: "Login",
    pinAlert: "PIN code must be 4 digits. Please try again.",
    adminSuccess: "Admin login successful",
    userSuccess: "User login successful",
    loginFailed: "Login failed. Please try again.",
    error: "An error occurred. Please try again.",
  },
  hi: {
    title: "भारतीय राष्ट्रीय कांग्रेस",
    login: "लॉगिन",
    pinLabel: "4-अंकीय पिन",
    pinPlaceholder: "****",
    loginBtn: "लॉगिन",
    pinAlert: "पिन कोड 4 अंकों का होना चाहिए. कृपया पुनः प्रयास करें",
    adminSuccess: "प्रशासक लॉगिन सफल",
    userSuccess: "उपयोगकर्ता लॉगिन सफल",
    loginFailed: "लॉगिन विफल. कृपया पुनः प्रयास करें।",
    error: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
  },
};

function Login({ language = "hi" }) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const t = TEXT[language] || TEXT.hi;

  const handlelogin = async (e) => {
    e.preventDefault();

    if (!/^\d{4}$/.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'PIN Error',
        text: t.pinAlert,
        confirmButtonText: 'OK'
      });
      return;
    }

   
    

    
    setIsLoading(true);
    
    
    Swal.fire({
      title: 'Logging in...',
      text: 'Please wait while we verify your credentials',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));   
        if (data.designation === "Admin") {
          localStorage.setItem("role", "admin");
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: t.adminSuccess,
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            navigate("/admin");
          });
        } else {
          localStorage.setItem("role", "user");
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: t.userSuccess,
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            navigate("/userpanel");
          });
        }
        setPassword("");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.error || t.loginFailed,
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: t.error,
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <h1>{t.title}</h1>
        <form onSubmit={handlelogin}>
          <h2>{t.login}</h2>
          <div className="form_group">
            <label htmlFor="password">{t.pinLabel}</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              maxLength={4}
              placeholder={t.pinPlaceholder}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value.replace(/\D/, "").slice(0, 4))
              }
            />
          </div>
          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : t.loginBtn}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;