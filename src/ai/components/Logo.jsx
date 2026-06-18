import { Link } from 'react-router-dom';
import { BRAND } from '../lib/constants';

// Brand mark — swap this SVG with your own logo file later if you have one.
export function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`group flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-grad shadow-glow transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          <path d="M12 2L3 20h18L12 2z" fill="currentColor" opacity="0.95" />
          <path d="M12 8l-4.5 9h9L12 8z" fill="#0b0b0f" opacity="0.35" />
        </svg>
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-white">
        {BRAND}
      </span>
    </Link>
  );
}
