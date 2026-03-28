interface PriceDisplayProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

export const PriceDisplay = ({ amount, className = '', size = 'md' }: PriceDisplayProps) => {
  return (
    <span className={`font-mono tabular-nums ${sizeClasses[size]} ${className}`}>
      ${amount.toLocaleString('es-MX')} <span className="text-muted-foreground text-[0.75em]">MXN</span>
    </span>
  );
};
