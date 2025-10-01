import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { data } from "../constants/numerology";
import { calculateNumber } from "../utils/calculateHoroscopeNumber";
import { Tag } from "primereact/tag";

const FAVORITES_KEY = "fortune-numbers:favorites";

export default function Calculator() {
  const toast = useRef(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [horoscope, setHoroscope] = useState("");

  // favorites: array of { name, number, horoscope }
  const [favorites, setFavorites] = useState([]);

  // load favorites from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) {
        setFavorites(JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Failed to load favorites", e);
    }
  }, []);

  // persist favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn("Failed to save favorites", e);
    }
  }, [favorites]);

  // favorites helpers
  const isFavorite = (n, num, hor) => {
    const trimmed = (n || "").trim();
    // compare by name + number (you can change comparison rule if needed)
    return favorites.some(
      (f) => f.name === trimmed && f.number === num && f.horoscope === hor
    );
  };

  const addFavorite = (name, number, horoscope) => {
    if (!name || !horoscope || !number) {
      toast.current?.show({
        severity: "warn",
        summary: "Cannot add",
        detail: "Generate a horoscope before adding to favorites",
        life: 1600,
      });
      return;
    }
    const fav = { name, number, horoscope };
    if (isFavorite(fav.name, fav.number, fav.horoscope)) {
      toast.current?.show({
        severity: "info",
        summary: "Already saved",
        life: 1200,
      });
      return;
    }
    setFavorites((prev) => [fav, ...prev]); // newest first
    toast.current?.show({
      severity: "success",
      summary: "Saved",
      detail: `${name} added to favorites`,
      life: 1400,
    });
  };

  const removeFavorite = (trimmed, number, horoscope) => {
    setFavorites((prev) =>
      prev.filter(
        (f) =>
          !(
            f.name === trimmed &&
            f.number === number &&
            f.horoscope === horoscope
          )
      )
    );
    toast.current?.show({
      severity: "success",
      summary: "Removed",
      detail: `${trimmed} removed from favorites`,
      life: 1400,
    });
  };

  const removeFavoriteIndex = (index) => {
    setFavorites((prev) => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      toast.current?.show({
        severity: "success",
        summary: "Removed",
        detail: `${removed?.name} removed`,
        life: 1200,
      });
      return copy;
    });
  };

  const toggleFavorite = () => {
    const trimmed = (name || "").trim();
    if (!trimmed || !horoscope) {
      toast.current?.show({
        severity: "warn",
        summary: "Cannot add",
        detail: "Generate a horoscope before favoriting",
        life: 1600,
      });
      return;
    }
    if (isFavorite(trimmed, number, horoscope)) {
      removeFavorite(trimmed, number, horoscope);
    } else {
      addFavorite(trimmed, number, data[number]);
    }
  };

  const loadFavorite = (fav) => {
    setName(fav.name);
    setNumber(fav.number);
    setHoroscope(fav.horoscope);
    toast.current?.show({
      severity: "info",
      summary: "Loaded",
      detail: `${fav.name} loaded`,
      life: 900,
    });
  };

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
                  {/* Copy */}
                  <Button
                    label="Copy"
                    icon="pi pi-copy"
                    onClick={copyHoroscope}
                    className="p-button-outlined p-button-info"
                    disabled={!horoscope}
                  />

                  {/* Favorite (star) */}
                  <Button
                    icon={
                      isFavorite(name, number, horoscope)
                        ? "pi pi-star"
                        : "pi pi-star"
                    }
                    onClick={toggleFavorite}
                    className={
                      isFavorite(name, number, horoscope)
                        ? "p-button-warning"
                        : "p-button-warning p-button-outlined"
                    }
                    aria-label={
                      isFavorite(name, number, horoscope)
                        ? "Unfavorite"
                        : "Add to favorites"
                    }
                    tooltip={
                      isFavorite(name, number, horoscope)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  />

                  {/* Reset */}
                  <Button
                    icon="pi pi-refresh"
                    onClick={clearAll}
                    className="p-button-rounded p-button-text p-button-info"
                    aria-label="Reset"
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

              {/* Favorites list */}
              <div className="col-12">
                <Divider align="left">
                  <div className="flex align-items-center gap-2">
                    <b>Favorites</b>
                    <Tag value={favorites.length} severity="help" rounded />
                  </div>
                </Divider>

                <div className="favorites-grid surface-0 p-2 border-round">
                  {favorites.length === 0 ? (
                    <div className="text-500 p-3">
                      No favorites yet. Add important entries by tapping the
                      star.
                    </div>
                  ) : (
                    <div className="grid">
                      {favorites.map((fav, idx) => (
                        <div
                          key={`${fav.name}-${idx}`}
                          className="col-12 md:col-6 lg:col-4 p-2"
                        >
                          <div className="surface-card p-3 border-round shadow-1 favorite-item flex flex-column gap-2">
                            <div className="flex align-items-center justify-content-between">
                              <div>
                                <div className="text-900 font-medium">
                                  {fav.name}
                                </div>
                                <small className="text-500">
                                  Number: {fav.number}
                                </small>
                              </div>

                              <div className="flex align-items-center gap-2">
                                <Button
                                  icon="pi pi-eye"
                                  className="p-button-text"
                                  tooltip="Load this favorite"
                                  onClick={() => loadFavorite(fav)}
                                />
                                <Button
                                  icon="pi pi-trash"
                                  className="p-button-danger p-button-text"
                                  tooltip="Remove"
                                  onClick={() => removeFavoriteIndex(idx)}
                                />
                              </div>
                            </div>

                            <div className="text-700" style={{ minHeight: 48 }}>
                              {fav.horoscope}
                            </div>
                          </div>
                        </div>
                      ))}
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
