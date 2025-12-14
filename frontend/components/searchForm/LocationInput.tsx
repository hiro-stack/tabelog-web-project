"use client";

import React, { useState } from "react";

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
  const [latError, setLatError] = useState<string>("");
  const [lngError, setLngError] = useState<string>("");

  const validate = (value: string, min: number, max: number, label: string): string => {
    const trimmed = value.trim();
    const num = Number(trimmed);

    if (trimmed === "") return `${label}を入力してください。`;
    if (isNaN(num)) return `${label}は数値で入力してください。`;
    if (num < min || num > max) return `${label}は ${min}〜${max} の範囲で入力してください。`;

    return "";
  };



  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const error = validate(value, -90, 90, "緯度");
    setLatError(error);
    if (!error) setLatitude(Number(value));
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const error = validate(value, -180, 180, "経度");
    setLngError(error);
    if (!error) setLongitude(Number(value));
  };

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
          className={`form-control ${latError ? "is-invalid" : ""}`}
          value={latitude || ""}
          onChange={handleLatitudeChange}
          placeholder="例: 35.6895"
        />
        {latError && <div className="invalid-feedback">{latError}</div>}
      </div>

      <div className="mb-4">
        <label className="form-label">現在地（経度）</label>
        <input
          type="number"
          className={`form-control ${lngError ? "is-invalid" : ""}`}
          value={longitude || ""}
          onChange={handleLongitudeChange}
          placeholder="例: 139.6917"
        />
        {lngError && <div className="invalid-feedback">{lngError}</div>}
      </div>
    </div>
  );
}
