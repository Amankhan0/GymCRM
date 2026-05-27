import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Pre-built color tones — pick by `tone` instead of passing raw classes.
const tones = {
  blue:   { icon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',         bar: 'from-blue-400/50 to-blue-600/50' },
  red:    { icon: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',             bar: 'from-red-400/60 to-rose-600/60' },
  green:  { icon: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',     bar: 'from-emerald-400/50 to-green-600/50' },
  purple: { icon: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', bar: 'from-purple-400/50 to-fuchsia-600/50' },
  amber:  { icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',     bar: 'from-amber-400/60 to-orange-600/60' },
  indigo: { icon: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', bar: 'from-indigo-400/50 to-violet-600/50' },
};

export function StatCard({ title, value, icon: Icon, tone = 'blue', subtitle, accent }) {
  const t = tones[tone] || tones.blue;
  return (
    <Card className="overflow-hidden relative hover:shadow-md transition-shadow">
      {/* Subtle gradient strip on top to add color without overpowering the data */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', t.bar)} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className={cn('text-3xl font-bold mt-2', accent)}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {Icon && (
            <div className={cn('rounded-lg p-3 shrink-0', t.icon)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
