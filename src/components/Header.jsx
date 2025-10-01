import React from "react";

export default function Header() {
  return (
    <header className="m-5">
      <div className="flex align-items-center justify-content-center gap-3">
        <div className="brand-badge">
          <i className="pi pi-sun" style={{ fontSize: 20 }}></i>
        </div>
        <div className="text-center">
          <h1 className="m-0 app-title text-blue-50">Fortune Numbers</h1>
          <small className="text-600">
            Finding Your Life's Blueprint in Numbers
          </small>
        </div>
      </div>
    </header>
  );
}
