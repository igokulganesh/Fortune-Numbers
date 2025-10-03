import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { data } from "../constants/numerology";
import FavoriteCards from "./favorite/FavoriteCard";
import FavoriteList from "./favorite/FavoriteList";
import { calculateNumber } from "../utils/calculateHoroscopeNumber";
import { Badge } from "primereact/badge";

const FAVORITES_KEY = "fortune-numbers:favorites";

export default function Calculator() {
  const toast = useRef(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [horoscope, setHoroscope] = useState("");

  // favorites: array of { name, number, horoscope }
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState("card"); // 'card' | 'list'

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
  const isFavorite = (name) => {
    const trimmed = (name || "").trim();
    // compare by name + number (you can change comparison rule if needed)
    return favorites.some(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase()
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
    if (isFavorite(fav.name)) {
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
    if (isFavorite(trimmed)) {
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

  const inputSection = (
    <div
      className="responsive-row"
      role="group"
      aria-label="Name input and generate"
    >
      <div className="input-wrap">
        <InputText
          id="nameInput"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
          aria-label="Name or text"
          style={{ width: "100%" }} // ensures input uses available width
        />
      </div>

      <div className="btn-wrap">
        <Button
          type="submit"
          label="Generate"
          icon="pi pi-sparkles"
          onClick={generateHoroscope}
          disabled={!name.trim()}
          aria-disabled={!name.trim()}
          className="full-width-btn" // used by CSS to become full width on small screens
          style={{ minWidth: 120 }} // keeps a reasonable button width on desktop
        />
      </div>
    </div>
  );

  const actionButtons = (
    <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
      <div className="flex align-items-center gap-2">
        <b className="text-700">Numerology</b>
        {number ? <Badge value={number} severity="info" /> : <></>}
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
          icon="pi pi-star"
          onClick={toggleFavorite}
          className={
            isFavorite(name)
              ? "p-button-warning"
              : "p-button-warning p-button-outlined"
          }
          disabled={!name.trim()}
          aria-label={isFavorite(name) ? "Unfavorite" : "Add to favorites"}
          tooltip={
            isFavorite(name) ? "Remove from favorites" : "Add to favorites"
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
  );

  const horoscopeResult = (
    <div>
      <small className="text-500">Horoscope</small>
      <div
        className="mt-2 p-3 surface-card border-round"
        style={{ minHeight: 80 }}
      >
        {horoscope ? (
          <div className="text-900">{horoscope}</div>
        ) : (
          <div className="text-500">No horoscope yet. Click Generate.</div>
        )}
      </div>
    </div>
  );

  const favoriteSection = (
    <div className="col-12">
      <Divider align="left"></Divider>
      <div className="flex justify-content-between flex-wrap mb-2">
        <div className="flex align-items-center gap-2">
          <b className="text-700">Favorites</b>
          <Badge value={favorites.length} severity="info" />
        </div>
        {/* toolbar: toggle buttons */}
        <div className="flex align-items-left justify-content-end gap-2 mb-2">
          <Button
            icon="pi pi-th-large"
            className={
              viewMode === "card" ? "p-button-raised" : "p-button-outlined"
            }
            onClick={() => setViewMode("card")}
            aria-pressed={viewMode === "card"}
          />
          <Button
            icon="pi pi-list"
            className={
              viewMode === "list" ? "p-button-raised" : "p-button-outlined"
            }
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
          />
        </div>
      </div>

      <div className="grid surface-0 p-2 border-round">
        {favorites.length === 0 ? (
          <div className="text-500 p-3">
            No favorites yet. Add important entries by tapping the star.
          </div>
        ) : viewMode === "card" ? (
          <FavoriteCards
            favorites={favorites}
            onLoad={loadFavorite}
            onRemove={removeFavoriteIndex}
          />
        ) : (
          <div className="col-12">
            <FavoriteList
              favorites={favorites}
              onLoad={loadFavorite}
              onRemove={removeFavoriteIndex}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <Card className="custom-card entrance" header={cardHeader}>
        <Toast ref={toast} />

        <form onSubmit={generateHoroscope} className="grid formgrid gap-3">
          {inputSection}

          {/* Result preview */}
          <div className="col-12">
            <Divider align="left" />
            <div className="surface-100 p-3 border-round shadow-1">
              {actionButtons}
              <Divider />
              {horoscopeResult}
              {favoriteSection}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
