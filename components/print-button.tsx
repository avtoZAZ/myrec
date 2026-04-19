"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="rounded-full bg-saffron px-3 py-1">
      Печать
    </button>
  );
}
