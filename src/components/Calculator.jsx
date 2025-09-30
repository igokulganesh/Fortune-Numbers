import React, { useState, useCallback } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { data } from "../data/content";

const alphabet = [
  1, 2, 3, 4, 5, 8, 3, 5, 1, 1, 2, 3, 4, 5, 7, 8, 1, 2, 3, 4, 6, 6, 6, 5, 1, 7,
];

export default function Calculator() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState(null);
  const [horoscope, setHoroscope] = useState("");
  const [error, setError] = useState("");

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

  // generate horoscope from current name
  const generateHoroscope = useCallback(
    (evt) => {
      if (evt && evt.preventDefault) evt.preventDefault();

      const trimmed = (name || "").trim();
      if (!trimmed) {
        setError("Please enter a name or text.");
        setNumber(null);
        setHoroscope("");
        return;
      }

      setError("");

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

  return (
    <div className="card p-4 max-w-xl mx-auto">
      <form onSubmit={generateHoroscope} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <InputText
            id="nameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name or text"
            aria-label="Name or text"
            className="p-inputtext-lg flex-1"
          />
          <Button
            type="submit"
            label="Submit"
            disabled={!name.trim()}
            aria-disabled={!name.trim()}
          />
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div aria-live="polite" className="mt-2">
          <div>
            <strong>Number:</strong> {number === null ? "-" : number}
          </div>
          <div className="mt-2">
            <strong>Horoscope:</strong>
            <p className="m-0">{horoscope}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
