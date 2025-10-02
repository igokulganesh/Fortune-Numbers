import React from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
/**
 * Card view for a favorite entry.
 * Props: fav (object), idx (index), onLoad (fn), onRemove (fn)
 */
export const FavoriteCard = ({ fav, idx, onLoad, onRemove }) => {
  return (
    <div key={`${fav.name}-${idx}`} className="col-12 md:col-6 lg:col-4 p-2">
      <div className="surface-card p-3 border-round shadow-1 favorite-item flex flex-column gap-2">
        <div className="flex align-items-center justify-content-between">
          <div>
            <div className="text-900 font-medium">{fav.name}</div>
            <small className="text-500">Number: {fav.number}</small>
          </div>

          <div className="flex align-items-center gap-2">
            <Button
              icon="pi pi-eye"
              className="p-button-text"
              tooltip="Load this favorite"
              onClick={() => onLoad(fav)}
              aria-label={`Load ${fav.name}`}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-danger p-button-text"
              tooltip="Remove"
              aria-label={`Remove ${fav.name}`}
              onClick={() => onRemove(idx)}
            />
          </div>
        </div>

        <div className="text-700">
          <ScrollPanel
            className="overflow-x-auto"
            style={{ minHeight: 120, maxHeight: 160 }}
          >
            {fav.horoscope}
          </ScrollPanel>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
