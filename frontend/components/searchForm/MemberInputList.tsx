"use client";

import React from "react";

interface Member {
  name: string;
  power: number;
  food: string;
  errors?: {
    name?: string;
    food?: string;
  };
}

interface MemberInputListProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

export default function MemberInputList({ members, setMembers }: MemberInputListProps) {
  const addMember = () =>
    setMembers([...members, { name: "", power: 1, food: "", errors: {} }]);

  const removeMember = (index: number) =>
    setMembers(members.filter((_, i) => i !== index));

  const updateMember = (
    index: number,
    field: keyof Member,
    value: string | number
  ) => {
    const updated = [...members];
    updated[index][field] = value as never;

    // バリデーション（nameとfoodの空チェック）
    if (field === "name" || field === "food") {
      const strVal = String(value).trim();
      updated[index].errors = {
        ...updated[index].errors,
        [field]: strVal === "" ? "この項目は必須です。" : undefined,
      };
    }

    setMembers(updated);
  };

  return (
    <div className="mb-4">
      <label className="form-label">メンバー設定</label>
      {members.map((m, idx) => (
        <div className="border rounded p-3 mb-3" key={idx}>
          <div className="mb-2">
            <label className="form-label">名前</label>
            <input
              type="text"
              className={`form-control ${m.errors?.name ? "is-invalid" : ""}`}
              placeholder="例: 佐藤"
              value={m.name}
              onChange={(e) => updateMember(idx, "name", e.target.value)}
            />
            {m.errors?.name && (
              <div className="invalid-feedback">{m.errors.name}</div>
            )}
          </div>

          <div className="mb-2">
            <label className="form-label">
              決定権（1は決定権が低い〜5は決定権が高い）
            </label>
            <div className="d-flex gap-3">
              {[1, 2, 3, 4, 5].map((val) => (
                <div className="form-check form-check-inline" key={val}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`power-${idx}`}
                    id={`power-${idx}-${val}`}
                    checked={m.power === val}
                    onChange={() => updateMember(idx, "power", val)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`power-${idx}-${val}`}
                  >
                    {val}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label">食べたいもの</label>
            <input
              type="text"
              className={`form-control ${m.errors?.food ? "is-invalid" : ""}`}
              placeholder="例: ラーメン、焼肉"
              value={m.food}
              onChange={(e) => updateMember(idx, "food", e.target.value)}
            />
            {m.errors?.food && (
              <div className="invalid-feedback">{m.errors.food}</div>
            )}
          </div>

          <div className="text-end">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => removeMember(idx)}
            >
              × 削除
            </button>
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-secondary" onClick={addMember}>
        ＋ メンバー追加
      </button>
    </div>
  );
}
