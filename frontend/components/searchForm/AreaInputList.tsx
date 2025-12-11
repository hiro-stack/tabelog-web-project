// AreaInputList.tsx
"use client";

import React from "react";

interface Area {
  name: string;
}

interface AreaInputListProps {
  areas: Area[];
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
}

export default function AreaInputList({ areas, setAreas }: AreaInputListProps) {
  const addArea = () => setAreas([...areas, { name: "" }]);
  const removeArea = (index: number) => setAreas(areas.filter((_, i) => i !== index));
  const updateArea = (index: number, value: string) => {
    const updated = [...areas];
    updated[index].name = value;
    setAreas(updated);
  };

  return (
    <div className="mb-4">
      <label className="form-label">調べたいエリア</label>
      {areas.map((area, idx) => (
        <div key={idx} className="mb-2 d-flex gap-2">
          <input
            type="text"
            className="form-control"
            value={area.name}
            onChange={(e) => updateArea(idx, e.target.value)}
            placeholder="例: 北千住駅"
          />
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => removeArea(idx)}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-primary" onClick={addArea}>
        ＋ エリア追加(駅名)
      </button>
    </div>
  );
}
