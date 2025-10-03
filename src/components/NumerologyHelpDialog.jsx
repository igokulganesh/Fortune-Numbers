import React, { useRef, useState, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { ALPHABET } from "../constants/alphabet";
import { sanitize } from "../utils/sanitizeInput";
import "../css/NumerologyHelpDialog.css";

/**
 * Return numeric value for a single character.
 * - If it's a digit (0-9), return the digit's numeric value.
 * - If it's a letter A-Z, return the mapping from ALPHABET.
 * - Otherwise return 0.
 */
function letterValue(letter) {
  if (!letter) return 0;

  // 1) If it's a single digit, return that number (e.g. '3' -> 3)
  if (/^[0-9]$/.test(letter)) {
    return Number(letter);
  }

  // 2) Otherwise attempt alphabet mapping (A->0 index)
  const idx = (letter || "").toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
  if (Number.isInteger(idx) && idx >= 0 && idx < ALPHABET.length)
    return ALPHABET[idx];

  // 3) Fallback: unknown characters contribute 0
  return 0;
}

export const NumerologyHelpDialog = ({ visible, setVisible }) => {
  const toast = useRef(null);

  const [exampleName, setExampleName] = useState("");

  const { letters, values, sum, reduced } = useMemo(() => {
    const cleaned = sanitize(exampleName).toUpperCase();
    const lettersArr = cleaned.split("");
    const vals = lettersArr.map((ch) => letterValue(ch));
    const total = vals.reduce((a, b) => a + b, 0);
    const reducedSum = String(total)
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
    return {
      letters: lettersArr,
      values: vals,
      sum: total,
      reduced: reducedSum,
    };
  }, [exampleName]);

  const exampleText = useMemo(() => {
    if (!letters.length) return "Type a name to see example calculation.";
    const pairs = letters.map((L, i) => `${L} → ${values[i]}`).join("\n");
    return `Example — ${exampleName.toUpperCase()}\n${pairs}\n\nSum: ${values.join(
      " + "
    )} = ${sum}\n(Optionally reduce: ${sum} → ${String(sum)
      .split("")
      .join(" + ")} → ${reduced})`;
  }, [letters, values, sum, reduced, exampleName]);

  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText(exampleText);
      toast.current?.show({
        severity: "success",
        summary: "Copied",
        detail: "Example copied to clipboard",
        life: 1400,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Copy failed",
        detail: "Unable to copy to clipboard",
        life: 1700,
      });
    }
  };

  const dialogFooter = (
    <div className="p-d-flex p-jc-end" style={{ gap: 8 }}>
      <Button
        icon="pi pi-copy"
        label="Copy Example"
        onClick={copyExample}
        className="p-button-outlined"
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="How Numerology Number is calculated"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "min(900px, 96vw)" }}
        modal
        footer={dialogFooter}
        aria-labelledby="numerology-help-title"
        className="nhd-dialog"
      >
        <div className="nhd-grid">
          {/* left: short explanation + live input */}
          <div className="nhd-left">
            <p className="nhd-blurb">
              We assign a fixed number to each letter (A–Z). Then we add the
              numbers for each letter of a name (and any digits). That total is
              the numerology number.
            </p>

            <Divider />

            <div className="nhd-input-row">
              <InputText
                id="nhd-name"
                value={exampleName}
                className="w-full"
                onChange={(e) => setExampleName(e.target.value)}
                placeholder="Try it - Type a name"
                aria-label="Example name"
              />
            </div>
            <Divider />
            <div className="nhd-example">
              <div className="nhd-example-row">
                <div className="nhd-example-title">Example calculation</div>
                <div className="nhd-example-name">
                  {exampleName.toUpperCase() || ""}
                </div>
              </div>

              <div className="nhd-example-letters">
                {letters.length ? (
                  letters.map((L, i) => (
                    <div key={L + i} className="nhd-letter-box">
                      <div className="nhd-letter-char">{L}</div>
                      <div className="nhd-letter-val">{values[i]}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-500">No letters yet</div>
                )}
              </div>

              <div className="nhd-sum-row">
                <div className="nhd-sum-label">Sum</div>
                <div className="nhd-sum-value">{sum}</div>
                <div className="nhd-reduced-note">
                  Reduced (digits summed): {reduced}
                </div>
              </div>
            </div>
          </div>

          {/* right: mapping table & visual calculation */}
          <div className="nhd-right">
            <div className="nhd-map-title">Letter → Number (A → Z)</div>

            <div className="nhd-mapping">
              {Array.from({ length: 26 }).map((_, idx) => {
                const letter = String.fromCharCode("A".charCodeAt(0) + idx);
                const value = ALPHABET[idx];
                return (
                  <div
                    key={letter}
                    className="nhd-mapping-cell"
                    title={`${letter} → ${value}`}
                  >
                    <div className="nhd-mapping-letter">{letter}</div>
                    <div className="nhd-mapping-value">{value}</div>
                  </div>
                );
              })}
            </div>

            <Divider />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default NumerologyHelpDialog;
