// Brand mark for Mailcoy.
// An iconic, ultra-sleek geometric emblem combining the previous sharp architectural elegance
// with subtle aerodynamic mail / envelope wings and an orb core.
export function Logomark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dynamic Left Wing */}
      <path
        d="M3 8.5L16 18L16 27.5L3 18V8.5Z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Dynamic Right Wing */}
      <path
        d="M29 8.5L16 18L16 27.5L29 18V8.5Z"
        fill="currentColor"
      />
      
      {/* Top Envelope Chevron Peak (Architectural Triangle Heritage) */}
      <path
        d="M16 4.5L28 13.5L16 22.5L4 13.5L16 4.5Z"
        fill="currentColor"
      />
      <path
        d="M16 8L24.5 14.5L16 20.5L7.5 14.5L16 8Z"
        fill="var(--background)"
      />
      
      {/* Center Radiant Orb */}
      <circle cx="16" cy="14.5" r="2.5" fill="currentColor" />
    </svg>
  );
}
