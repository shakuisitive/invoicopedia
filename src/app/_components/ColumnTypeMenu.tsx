"use client";

import { useEffect, useRef } from "react";
import type { ColumnType } from "@/app/types/estimates";

interface ColumnTypeMenuProps {
  onSelect: (type: ColumnType) => void;
  onClose: () => void;
  position: { x: number; y: number } | null;
}

export function ColumnTypeMenu({
  onSelect,
  onClose,
  position,
}: ColumnTypeMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const types: ColumnType[] = [
    "text",
    "status",
    "owner",
    "date",
    "formula",
    "number",
    "label",
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bg-white shadow-lg rounded-md border p-2 min-w-[150px] z-50"
      style={{ top: position.y, left: position.x }}
    >
      {types.map((type) => (
        <button
          key={type}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded capitalize"
          onClick={() => {
            onSelect(type);
            onClose();
          }}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
