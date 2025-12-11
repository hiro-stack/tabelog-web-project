"use client";

import React from "react";

interface WeightSelectorGroupProps {
  weightDistance: number;
  setWeightDistance: (val: number) => void;
  weightBudget: number;
  setWeightBudget: (val: number) => void;
  weightRating: number;
  setWeightRating: (val: number) => void;
}

export default function WeightSelectorGroup({
  weightDistance,
  setWeightDistance,
  weightBudget,
  setWeightBudget,
  weightRating,
  setWeightRating,
}: WeightSelectorGroupProps) {
  const renderButtons = (selected: number, setter: (val: number) => void) => (
    <div className="d-flex flex-wrap gap-2">
      {[...Array(10)].map((_, i) => {
        const weight = 1.0 + (i + 1) * 0.1;
        const roundedWeight = parseFloat(weight.toFixed(1)); 
        return (
          <button
            key={i}
            type="button"
            className={`btn btn-sm ${selected === roundedWeight ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setter(roundedWeight)}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mb-4">
      <label className="form-label">距離の重み（1 = 重視しない / 10 = 最重視）</label>
      {renderButtons(weightDistance, setWeightDistance)}

      <label className="form-label mt-3">価格の重み（1 = 重視しない / 10 = 最重視）</label>
      {renderButtons(weightBudget, setWeightBudget)}

      <label className="form-label mt-3">評価の重み（1 = 重視しない / 10 = 最重視）</label>
      {renderButtons(weightRating, setWeightRating)}
    </div>
  );
}
