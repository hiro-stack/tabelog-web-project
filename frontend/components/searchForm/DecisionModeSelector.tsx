"use client";

import React from "react";

interface Props {
  value: number;
  onChange: (val: number) => void;
}

export default function DecisionModeSelector({ value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="form-label">意思決定の方式</label>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="decisionMode"
          value="0"
          checked={value === 0}
          onChange={() => onChange(0)}
        />
        <label className="form-check-label">多数決を重視する</label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="decisionMode"
          value="1"
          checked={value === 1}
          onChange={() => onChange(1)}
        />
        <label className="form-check-label">決定権の強さを重視する</label>
      </div>
    </div>
  );
}
