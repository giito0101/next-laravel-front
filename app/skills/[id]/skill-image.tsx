"use client";

import { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#dff7f2" />
          <stop offset="100%" stop-color="#f7efe2" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" rx="48" />
      <circle cx="920" cy="220" r="120" fill="#99f6e4" opacity="0.45" />
      <circle cx="320" cy="620" r="160" fill="#fcd9b6" opacity="0.5" />
      <rect x="160" y="180" width="880" height="440" rx="36" fill="#ffffff" opacity="0.9" />
      <text x="600" y="382" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#0f172a">Skill Image</text>
      <text x="600" y="438" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#475569">No image available</text>
    </svg>
  `);

type SkillImageProps = {
  alt: string;
  src?: string | null;
};

export function SkillImage({ alt, src }: SkillImageProps) {
  const [currentSource, setCurrentSource] = useState(src || FALLBACK_IMAGE);

  return (
    <img
      src={currentSource}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => {
        setCurrentSource(FALLBACK_IMAGE);
      }}
    />
  );
}
