interface ConsolidationBannerProps {
  names: string[];
  timerText: string;
}

export const ConsolidationBanner = ({ names, timerText }: ConsolidationBannerProps) => {
  const othersCount = names.length - 1;
  const display =
    names.length === 1
      ? names[0]
      : `${names[0]} y ${othersCount} más`;

  return (
    <div className="bg-accent/30 border border-accent rounded-chip px-4 py-2.5 flex items-center gap-2 text-xs">
      <span>👥</span>
      <span className="text-foreground font-medium">
        {display} están ordenando
      </span>
      <span className="text-muted-foreground">·</span>
      <span className="font-mono text-muted-foreground">{timerText}</span>
    </div>
  );
};
