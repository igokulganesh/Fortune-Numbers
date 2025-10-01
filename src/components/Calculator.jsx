import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { data } from "../constants/numerology";
import { calculateNumber } from "../utils/calculateHoroscopeNumber";

export default function Calculator() {
  const toast = useRef(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [horoscope, setHoroscope] = useState("");

  const handleNameChange = (e) => {
    const newName = e?.target?.value ?? "";
    setName(newName);
    setNumber(calculateNumber(newName));
  };

  // generate horoscope from current name
  const generateHoroscope = (evt) => {
    if (evt && evt.preventDefault) evt.preventDefault();

    const trimmed = (name || "").trim();
    if (!trimmed) {
      setNumber(0);
      setHoroscope("");
      return;
    }

    let result = calculateNumber(trimmed);

    if (result > 108 || result < 0) {
      result = 0;
    }

    setNumber(result);
    setHoroscope(data[result] || "No horoscope found.");
  };

  const clearAll = () => {
    setName("");
    setNumber(0);
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
    <div className="page-wrapper">
      <Card className="custom-card entrance" header={cardHeader}>
        <Toast ref={toast} />

        <form onSubmit={generateHoroscope} className="grid formgrid gap-3">
          <div className="col-12 flex flex-wrap align-items-center justify-content-center gap-1">
            <div className="col-8">
              <InputText
                id="nameInput"
                value={name}
                onChange={handleNameChange}
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
    </div>
  );
}
