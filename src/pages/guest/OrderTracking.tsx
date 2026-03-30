import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Check } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { mockMenuItems } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  const firstRound = rounds[0];

  const [elapsed, setElapsed] = useState(0);

  // Timer counts from the first round's creation
  useEffect(() => {
    if (!firstRound) return;
    const start = new Date(firstRound.createdAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [firstRound]);

  // Build item laps from ALL rounds, sorted by prepTime
  const laps: ItemLap[] = useMemo(() => {
    if (rounds.length === 0) return [];
    return rounds
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
  }, [rounds]);

  const maxPrepTime = laps.length > 0 ? Math.max(...laps.map((l) => l.prepTime)) : 15;
  const estimatedSeconds = maxPrepTime * 60;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPct = Math.min((elapsed / estimatedSeconds) * 100, 100);
  const remainingSeconds = Math.max(estimatedSeconds - elapsed, 0);
  const remainingMin = Math.ceil(remainingSeconds / 60);

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
        {/* Timer hero */}
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
                  {timeStr}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {remainingSeconds > 0
              ? `Tiempo estimado: ~${remainingMin} min restantes`
              : '¡Tu orden debería estar lista!'}
          </p>
        </motion.div>

        {/* Global progress */}
        <div className="mb-8">
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* Item timeline / laps */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Timeline de tu orden
          </h2>
          <div className="space-y-0">
            {laps.map((lap, idx) => {
              // Each item's elapsed is relative to its own round's createdAt
              const itemElapsed = Math.floor((Date.now() - new Date(lap.createdAt).getTime()) / 1000);
              const lapSeconds = lap.prepTime * 60;
              const isDone = itemElapsed >= lapSeconds;
              const isNext = !isDone && (idx === 0 || laps.slice(0, idx).every((prev) => {
                const prevElapsed = Math.floor((Date.now() - new Date(prev.createdAt).getTime()) / 1000);
                return prevElapsed >= prev.prepTime * 60;
              }) || itemElapsed > 0);
              const lapProgress = isDone ? 100 : Math.min((itemElapsed / lapSeconds) * 100, 100);

              return (
                <motion.div
                  key={`${lap.name}-${idx}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center pt-1">
                      <motion.div
                        animate={isNext ? { scale: [1, 1.2, 1] } : {}}
                        transition={isNext ? { duration: 1.5, repeat: Infinity } : {}}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-primary text-primary-foreground'
                            : isNext
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
                      {idx < laps.length - 1 && (
                        <div className={`w-0.5 h-10 mt-1 ${isDone ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>

                    {/* Item card */}
                    <div className={`flex-1 pb-4 ${!isDone && !isNext ? 'opacity-50' : ''}`}>
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
                              {isDone ? '✓ Listo' : `~${lap.prepTime} min`}
                            </span>
                          </div>
                          {(isNext || isDone) && (
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
