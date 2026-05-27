import { cn } from '@/lib/utils';

// Letter-and-color avatar. User asked specifically: no uploads, no random pics — derive a
// stable color from the name so the same person always gets the same swatch.
const PALETTE = [
  'bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-cyan-500',   'bg-purple-500', 'bg-blue-500',   'bg-pink-500',
  'bg-teal-500',   'bg-orange-500', 'bg-fuchsia-500', 'bg-sky-500',
];

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const hash = (s = '') => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export function Avatar({ name = '', size = 'md', className }) {
  const trimmed = String(name).trim();
  const letter = trimmed.charAt(0).toUpperCase() || '?';
  const color = PALETTE[hash(trimmed) % PALETTE.length];
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 select-none',
        color,
        SIZES[size] || SIZES.md,
        className
      )}
      title={trimmed || 'User'}
    >
      {letter}
    </div>
  );
}
