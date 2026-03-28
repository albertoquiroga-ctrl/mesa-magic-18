import { useEffect, useState } from 'react';

interface TimerCountdownProps {
  totalSeconds: number;
  onComplete?: () => void;
  className?: string;
}

export const TimerCountdown = ({ totalSeconds, onComplete, className = '' }: TimerCountdownProps) => {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(timer);
  }, [remaining, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = remaining / totalSeconds;

  const colorClass =
    progress > 0.5 ? 'bg-success' : progress > 0.2 ? 'bg-warning' : 'bg-destructive';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-mono text-sm tabular-nums">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
