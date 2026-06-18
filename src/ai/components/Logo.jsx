import { Link } from 'react-router-dom';
import { BRAND } from '../lib/constants';

// Nyra brand mark — an "N" monogram with a spark accent. Swap this SVG with your own logo file
// later if you have one.
export function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`group flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-grad shadow-glow transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px] text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 18V6l12 12V6" />
        </svg>
        {/* spark accent — the "AI magic" dot */}
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-white ring-2 ring-ink-950" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-white">
        {BRAND}
      </span>
    </Link>
  );
}
