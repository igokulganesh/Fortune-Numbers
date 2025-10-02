import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

/**
 * List view row for a favorite entry.
 * More compact, suitable for scanning.
 */
export const FavoriteList = ({ favorites, onLoad, onRemove }) => {
  /* inside your component (near state/hooks) */
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width:500px)").matches
      : false
  );
  const [isMedium, setIsMedium] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width:1024px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqSmall = window.matchMedia("(max-width:640px)"); // mobile
    const mqMedium = window.matchMedia("(max-width:1024px)"); // tablet-ish

    const onChangeSmall = (e) => setIsSmall(e.matches);
    const onChangeMedium = (e) => setIsMedium(e.matches);

    // set initial
    setIsSmall(mqSmall.matches);
    setIsMedium(mqMedium.matches);

    // add listeners (use addEventListener where available)
    if (mqSmall.addEventListener)
      mqSmall.addEventListener("change", onChangeSmall);
    else mqSmall.addListener(onChangeSmall);

    if (mqMedium.addEventListener)
      mqMedium.addEventListener("change", onChangeMedium);
    else mqMedium.addListener(onChangeMedium);

    return () => {
      if (mqSmall.removeEventListener)
        mqSmall.removeEventListener("change", onChangeSmall);
      else mqSmall.removeListener(onChangeSmall);

      if (mqMedium.removeEventListener)
        mqMedium.removeEventListener("change", onChangeMedium);
      else mqMedium.removeListener(onChangeMedium);
    };
  }, []);

  // helper to pick max length based on current breakpoint
  const getHoroscopeMaxLen = () => {
    if (isSmall) return 40; // very short on mobile
    if (isMedium) return 80; // medium on tablet
    return 140; // desktop
  };

  const shortHoroscope = (text) => {
    if (!text) return "";
    const max = getHoroscopeMaxLen();
    return text.length <= max ? text : text.slice(0, max).trim() + "…";
  };

  // Render the horoscope cell (short form + full on hover)
  const horoscopeBody = (rowData) => {
    const short = shortHoroscope(rowData.horoscope);
    return (
      <div
        title={rowData.horoscope || ""} // full text on hover
        style={{
          whiteSpace: "pre-wrap",
          cursor: rowData.horoscope ? "help" : "default",
        }}
        aria-label={`Horoscope for ${rowData.name}`}
      >
        {short || <span className="text-500">—</span>}
      </div>
    );
  };

  // Actions column (load, delete)
  const actionsBody = (rowData, { rowIndex }) => {
    return (
      <div className="flex align-items-center gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-text"
          tooltip="Load"
          onClick={() => onLoad(rowData)}
          aria-label={`Load ${rowData.name}`}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger"
          tooltip="Remove"
          onClick={() => onRemove(rowIndex)}
          aria-label={`Remove ${rowData.name}`}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={favorites}
      scrollable
      scrollHeight="400px"
      className="p-datatable-sm"
      emptyMessage="No favorites available"
      tableClassName="min-w-full"
    >
      <Column
        field="name"
        header="Name"
        sortable
        body={(row) => <div className="font-medium text-900">{row.name}</div>}
      />
      <Column
        field="number"
        header="Number"
        style={{ width: "8rem" }}
        body={(row) => <Tag value={row.number} severity="info" />}
        sortable
      />
      <Column
        field="horoscope"
        header="Horoscope"
        body={horoscopeBody}
        hidden={isSmall}
      />
      <Column header="Actions" body={actionsBody} style={{ width: "10rem" }} />
    </DataTable>
  );
};

export default FavoriteList;
