import { Loader2 } from 'lucide-react';

export function Loading({ label = 'Loading...', className = '' }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="ml-2 text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
