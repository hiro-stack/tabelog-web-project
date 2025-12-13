"use client";

import React from "react";

interface Props {
  latitude: number;
  longitude: number;
  setLatitude: (val: number) => void;
  setLongitude: (val: number) => void;
}

export default function LocationInput({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}: Props) {
  return (
    <div>
      <small className="form-text text-muted">
        ※緯度・経度は Google マップなどで調べることができます。
      </small>
      <small className="form-text text-muted">
        https://support.google.com/maps/answer/18539?hl=ja
      </small>

      <div className="mb-4">
        <label className="form-label">現在地（緯度）</label>
        <input
          type="number"
          className="form-control"
          value={latitude || ""}
          onChange={(e) => setLatitude(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">現在地（経度）</label>
        <input
          type="number"
          className="form-control"
          value={longitude || ""}
          onChange={(e) => setLongitude(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
