import React from "react";

interface Props {
  value: number;
  label: string;
}

export function CountdownUnit({ value, label }: Props) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div
        className="countdown-digit text-white"
        style={{
          fontSize: "clamp(3rem, 9vw, 8rem)",
          lineHeight: 1,
          letterSpacing: "0.02em",
          fontFamily: "'Bebas Neue', monospace",
          textShadow: "0 0 30px rgba(229,9,20,0.5)",
        }}
      >
        {display}
      </div>
      <div
        className="uppercase tracking-widest mt-1"
        style={{ color: "#B3B3B3", fontSize: "clamp(0.6rem, 1.5vw, 0.85rem)" }}
      >
        {label}
      </div>
    </div>
  );
}
