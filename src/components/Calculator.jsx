import React, { useState, useCallback, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { data } from "../data/content";

const alphabet = [
  1, 2, 3, 4, 5, 8, 3, 5, 1, 1, 2, 3, 4, 5, 7, 8, 1, 2, 3, 4, 6, 6, 6, 5, 1, 7,
];

export default function Calculator() {
  const toast = useRef(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(null);
  const [horoscope, setHoroscope] = useState("");

  // sanitize input safely (with a fallback if Unicode property escapes are unsupported)
  const sanitize = (s) => {
    if (!s) return "";
    // remove punctuation/control chars and whitespace
    try {
      return s.replace(/[\p{P}\p{C}\s]/gu, "").toLowerCase();
    } catch {
      // fallback (less precise for some unicode chars)
      return s.replace(/[\W_]/g, "").toLowerCase();
    }
  };

  // calculate the numeric value for a given string
  const calculateNumber = useCallback((str) => {
    if (typeof str !== "string") return 0;
    let sum = 0;
    const cleaned = sanitize(str).replace(/\s+/g, ""); // extra safety
    for (let i = 0; i < cleaned.length; i++) {
      const c = cleaned[i];
      if (!isNaN(c)) {
        sum += Number(c);
      } else {
        const index = c.charCodeAt(0) - "a".charCodeAt(0);
        if (index >= 0 && index < alphabet.length) {
          sum += alphabet[index];
        }
      }
    }
    return sum;
  }, []);

  // Live compute number when `name` changes (UI preview)
  useEffect(() => {
    setNumber(name ? calculateNumber(name) : 0);
  }, [name, calculateNumber]);

  // generate horoscope from current name
  const generateHoroscope = useCallback(
    (evt) => {
      if (evt && evt.preventDefault) evt.preventDefault();

      const trimmed = (name || "").trim();
      if (!trimmed) {
        setNumber(null);
        setHoroscope("");
        return;
      }

      let result = calculateNumber(trimmed);

      // mirror original Lua logic
      if (result > 108 || result < 0) {
        result = 0;
      }

      setNumber(result);
      setHoroscope(data[result] || "No horoscope found.");
    },
    [name, calculateNumber]
  );

  const clearAll = () => {
    setName("");
    setNumber(null);
    setHoroscope("");
  };

  const copyHoroscope = async () => {
    if (!horoscope) {
      toast.current?.show({
        severity: "warn",
        summary: "Nothing to copy",
        life: 1200,
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(horoscope);
      toast.current?.show({
        severity: "success",
        summary: "Copied",
        detail: "Horoscope copied to clipboard",
        life: 1400,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Copy failed",
        life: 1400,
      });
    }
  };

  const cardHeader = (
    <div className="calc-card-header flex align-items-center gap-3">
      <div className="logo-circle">
        <i className="pi pi-star-fill" style={{ fontSize: 22 }}></i>
      </div>
      <div>
        <h3 className="m-0 text-primary">Decoded Destiny</h3>
        <small className="text-600 text-secondary">
          The mystic key to your success through numerology
        </small>
      </div>
    </div>
  );

  return (
    <Card className="custom-card" header={cardHeader}>
      <Toast ref={toast} />

      <form onSubmit={generateHoroscope} className="grid formgrid gap-3">
        <div className="col-12 flex flex-wrap align-items-center justify-content-center gap-1">
          <div className="col-8">
            <InputText
              id="nameInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-inputtext-lg name-input"
              aria-label="Name or text"
            />
          </div>
          <div className="col-2">
            <Button
              type="submit"
              label="Generate"
              icon="pi pi-sparkles"
              className="p-button-raised p-button-success"
              disabled={!name.trim()}
              aria-disabled={!name.trim()}
            />
          </div>
        </div>

        {/* Result preview */}
        <div className="col-12">
          <Divider align="left"></Divider>

          <div className="surface-100 p-3 border-round shadow-1">
            <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
              <div className="flex align-items-center gap-3">
                <div>
                  <b className="text-700">
                    Number{number ? ": " + number : ""}
                  </b>
                </div>
              </div>

              <div className="flex align-items-center gap-2">
                <Button
                  label="Copy"
                  icon="pi pi-copy"
                  onClick={copyHoroscope}
                  className="p-button-outlined p-button-info"
                  disabled={!horoscope}
                />
                <Button
                  icon="pi pi-refresh"
                  onClick={clearAll}
                  className="p-button-rounded p-button-text p-button-info"
                />
              </div>
            </div>

            <Divider />

            <div>
              <small className="text-500">Horoscope</small>
              <div
                className="mt-2 p-3 surface-card border-round"
                style={{ minHeight: 80 }}
              >
                {horoscope ? (
                  <div className="text-900">{horoscope}</div>
                ) : (
                  <div className="text-500">
                    No horoscope yet. Click Generate.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
