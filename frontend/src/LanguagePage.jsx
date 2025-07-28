import React from "react";

const LanguagePage = ({ onSelectLanguage, onCancel }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px 32px 24px 32px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 26, margin: 0, textAlign: "center" }}>
          Choose Language
        </h2>
        <div style={{ fontSize: 20, margin: "8px 0 24px 0", textAlign: "center" }}>
          भाषा चुनें
        </div>
        <button
          style={{
            width: "100%",
            padding: "12px 0",
            fontSize: 18,
            fontWeight: 600,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            marginBottom: 16,
            cursor: "pointer",
          }}
          onClick={() => onSelectLanguage('en')}
        >
          English
        </button>
        <button
          style={{
            width: "100%",
            padding: "12px 0",
            fontSize: 18,
            fontWeight: 600,
            background: "#219653",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            marginBottom: 16,
            cursor: "pointer",
          }}
          onClick={() => onSelectLanguage('hi')}
        >
          हिंदी (Hindi)
        </button>
        <button
          style={{
            width: "100%",
            padding: "12px 0",
            fontSize: 16,
            fontWeight: 500,
            background: "#e0e0e0",
            color: "#333",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LanguagePage; 