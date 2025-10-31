"use client";

export function Spinner() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </span>
  );
}
