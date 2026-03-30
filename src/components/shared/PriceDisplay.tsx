/**
 * PriceDisplay
 * 
 * Consistent price formatting component used across all screens.
 * Renders prices in MXN with monospaced tabular numbers for alignment.
 */

interface PriceDisplayProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
} as const;

export const PriceDisplay = ({ amount, className = '', size = 'md' }: PriceDisplayProps) => (
  <span className={`font-mono tabular-nums ${sizeClasses[size]} ${className}`}>
    ${amount.toLocaleString('es-MX')}{' '}
    <span className="text-muted-foreground text-[0.75em]">MXN</span>
  </span>
);
