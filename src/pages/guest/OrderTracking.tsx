import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Check } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { mockMenuItems } from '@/data/mockData';
import { Button } from '@/components/ui/button';


interface ItemLap {
  name: string;
  quantity: number;
  prepTime: number; // minutes
  image?: string;
  roundNum: number;
  createdAt: string; // ISO timestamp of the round this item belongs to
}

const OrderTracking = ({ embedded = false }: { embedded?: boolean }) => {
  const navigate = useNavigate();
  const rounds = useOrderStore((s) => s.rounds);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (rounds.length === 0) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [rounds]);

  // Only show items ordered by this device (the user's own orders)
  const myRounds = useMemo(() =>
    rounds
      .map((round) => ({
        ...round,
        items: round.items.filter((item) => item.orderedByDevice),
      }))
      .filter((round) => round.items.length > 0),
    [rounds]
  );

  // Build item laps from the user's rounds only
  const laps: ItemLap[] = useMemo(() => {
    if (myRounds.length === 0) return [];
    return myRounds
      .flatMap((round) =>
        round.items.map((item) => {
          const menuItem = mockMenuItems.find((m) => m.name === item.name);
          return {
            name: item.name,
            quantity: item.quantity,
            prepTime: menuItem?.prepTime ?? 10,
            image: menuItem?.image,
            roundNum: round.round,
            createdAt: round.createdAt,
          };
        })
      )
      .sort((a, b) => a.prepTime - b.prepTime);
  }, [myRounds]);

  // Compute status for every item
  const itemStatuses = laps.map((lap) => {
    const itemElapsed = Math.floor((now - new Date(lap.createdAt).getTime()) / 1000);
    const lapSeconds = lap.prepTime * 60;
    const remaining = Math.max(lapSeconds - itemElapsed, 0);
    return { ...lap, remaining, isDone: remaining <= 0 };
  });

  const pendingItems = itemStatuses.filter((l) => !l.isDone);
  const doneCount = itemStatuses.filter((l) => l.isDone).length;
  const totalCount = itemStatuses.length;

  // Sort pending by remaining time ascending — next to arrive first
  const sortedPending = [...pendingItems].sort((a, b) => a.remaining - b.remaining);
  const nextItem = sortedPending.length > 0 ? sortedPending[0] : null;

  const nextRemainingSeconds = nextItem?.remaining ?? 0;
  const nextRemainingMin = Math.ceil(nextRemainingSeconds / 60);
  const timerMin = Math.floor(nextRemainingSeconds / 60);
  const timerSec = nextRemainingSeconds % 60;
  const timeStr = `${String(timerMin).padStart(2, '0')}:${String(timerSec).padStart(2, '0')}`;
  const allDone = pendingItems.length === 0 && laps.length > 0;

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <p className="text-sm text-muted-foreground">No hay órdenes activas</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/guest/menu')}>
          Ir al menú
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header - only when standalone */}
      {!embedded && (
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              onClick={() => navigate('/guest/menu')}
              className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-base font-semibold text-foreground">Seguimiento de orden</h1>
          </div>
        </header>
      )}

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-36">
        {/* Timer hero — countdown to next item */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="relative w-32 h-32 mb-4">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.08, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-primary"
            />
            <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-1" />
                <span className="text-2xl font-bold font-mono tabular-nums text-foreground">
                  {allDone ? '00:00' : timeStr}
                </span>
              </div>
            </div>
          </div>
          {!allDone && (
            <p className="text-[11px] text-muted-foreground mb-1">
              {doneCount > 0 ? `${doneCount} de ${totalCount} listos` : `${totalCount} platillos en preparación`}
            </p>
          )}
          <p className="text-sm text-muted-foreground text-center">
            {allDone
              ? '¡Todos tus platillos están listos!'
              : nextItem
              ? `Siguiente: ${nextItem.name} (~${nextRemainingMin} min)`
              : 'Calculando...'}
          </p>
        </motion.div>

        {/* Item timeline grouped by round */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Timeline de tu orden
          </h2>
          {myRounds.map((round) => {
            const roundLaps = laps.filter((l) => l.roundNum === round.round);
            if (roundLaps.length === 0) return null;
            return (
              <div key={round.id} className="mb-5">
                {/* Round separator */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Ronda {round.round}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-0">
                  {roundLaps.map((lap, idx) => {
                    const status = itemStatuses.find(
                      (s) => s.name === lap.name && s.roundNum === lap.roundNum
                    );
                    const remaining = status?.remaining ?? 0;
                    const isDone = status?.isDone ?? false;
                    const itemElapsed = Math.floor((now - new Date(lap.createdAt).getTime()) / 1000);
                    const lapSeconds = lap.prepTime * 60;
                    const isActive = !isDone && itemElapsed > 0;
                    const lapProgress = isDone ? 100 : Math.min((itemElapsed / lapSeconds) * 100, 100);
                    const remMin = Math.floor(remaining / 60);
                    const remSec = remaining % 60;
                    const remStr = `${String(remMin).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;

                    return (
                      <motion.div
                        key={`${lap.name}-${lap.roundNum}-${idx}`}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center pt-1">
                            <motion.div
                              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                              transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                isDone
                                  ? 'bg-primary text-primary-foreground'
                                  : isActive
                                  ? 'bg-primary/20 text-primary ring-2 ring-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {isDone ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <span className="text-[10px] font-bold font-mono">{lap.prepTime}′</span>
                              )}
                            </motion.div>
                            {idx < roundLaps.length - 1 && (
                              <div className={`w-0.5 h-10 mt-1 ${isDone ? 'bg-primary' : 'bg-border'}`} />
                            )}
                          </div>

                          <div className={`flex-1 pb-4 ${!isDone && !isActive ? 'opacity-50' : ''}`}>
                            <div className="flex items-center gap-3">
                              {lap.image && (
                                <img
                                  src={lap.image}
                                  alt={lap.name}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-foreground truncate">
                                    {lap.quantity > 1 && (
                                      <span className="text-muted-foreground font-mono mr-1">{lap.quantity}×</span>
                                    )}
                                    {lap.name}
                                  </span>
                                  <span className={`text-[11px] font-mono shrink-0 ml-2 ${isDone ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                                    {isDone ? '✓ Listo' : remStr}
                                  </span>
                                </div>
                                {(isActive || isDone) && (
                                  <div className="mt-1.5">
                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                      <motion.div
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lapProgress}%` }}
                                        transition={{ duration: 0.5 }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - only when standalone */}
      {!embedded && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border px-4 py-4 z-30">
          <Button
            variant="outline"
            className="w-full h-12 rounded-button text-base font-medium"
            onClick={() => navigate('/guest/menu')}
          >
            Volver al menú
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
