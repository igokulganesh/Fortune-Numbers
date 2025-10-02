import React from "react";
import "../css/header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-badge">
          <i className="pi pi-sun" style={{ fontSize: "1.25rem" }}></i>
        </div>
        <div className="header-text">
          <h1 className="app-title">Fortune Numbers</h1>
          <small className="app-subtitle">
            Finding Your Life's Blueprint in Numbers
          </small>
        </div>
      </div>
    </header>
  );
}
