import { ReactNode } from 'react';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface NotificationCardProps {
  priority: Priority;
  title: string;
  subtitle?: string;
  time?: string;
  actions?: ReactNode;
}

const borderColors: Record<Priority, string> = {
  low: 'border-l-warning',
  medium: 'border-l-priority-high',
  high: 'border-l-success',
  urgent: 'border-l-destructive',
};

const borderWidths: Record<Priority, string> = {
  low: 'border-l-[3px]',
  medium: 'border-l-[3px]',
  high: 'border-l-[3px]',
  urgent: 'border-l-4',
};

export const NotificationCard = ({
  priority,
  title,
  subtitle,
  time,
  actions,
}: NotificationCardProps) => {
  return (
    <div
      className={`rounded-card bg-card p-4 ${borderWidths[priority]} ${borderColors[priority]} ${
        priority === 'urgent' ? 'bg-destructive/5' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {time && (
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
            {time}
          </span>
        )}
      </div>
      {actions && <div className="flex gap-2 mt-3">{actions}</div>}
    </div>
  );
};
