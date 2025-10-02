import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import UPI_QR from "../assets/UPI_QR.jpeg";
import "../css/footer.css";

export default function Footer() {
  const [visible, setVisible] = useState(false);

  // replace with your real UPI id
  const upiId = "igokulganesh@okhdfcbank";

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn(err);
    }
  };

  const dialog = (
    <Dialog
      header="Thank you! 😀"
      visible={visible}
      onHide={() => setVisible(false)}
      modal
    >
      <img src={UPI_QR} alt={upiId} className="qr-image" height="300" />
      <div className="flex align-items-center">
        <div className="flex-1">
          <small className="text-500">Scan the QR or copy the UPI ID</small>
        </div>
        <Button
          icon="pi pi-copy"
          className="p-button-outlined"
          onClick={() => copyToClipboard(upiId, "UPI ID copied")}
          aria-label="Copy UPI ID"
        />
      </div>
    </Dialog>
  );

  return (
    <footer
      className="support-footer border-round p-3 shadow-2"
      role="contentinfo"
    >
      <div className="footer-inner flex align-items-center justify-content-between">
        <div className="footer-left">
          <div className="footer-title">
            Love this tool? Support the developer! ❤️
          </div>
          <div className="footer-sub text-500">
            Small tip helps keep the project alive ✨
          </div>
        </div>

        <div className="footer-actions flex align-items-center gap-2">
          <Button
            label="Support"
            icon="pi pi-heart"
            className="p-button-rounded p-button-help p-mr-2"
            onClick={() => setVisible(true)}
            aria-haspopup="dialog"
          />
          <a
            className="text-500 footer-credit"
            href="https://github.com/igokulganesh/Fortune-Numbers"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open project on GitHub"
          >
            View on GitHub
          </a>
        </div>
      </div>
      {dialog}
    </footer>
  );
}
