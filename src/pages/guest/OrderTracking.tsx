import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ChefHat, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const STEPS = [
  { icon: CheckCircle2, label: 'Orden recibida', description: 'Tu mesero confirmó tu pedido' },
  { icon: ChefHat, label: 'En preparación', description: 'La cocina está trabajando en tu orden' },
  { icon: UtensilsCrossed, label: '¡Lista!', description: 'Tu orden está en camino a la mesa' },
];

const ESTIMATED_MINUTES = 18;

const OrderTracking = () => {
  const navigate = useNavigate();
  const rounds = useOrderStore((s) => s.rounds);
  const latestRound = rounds[rounds.length - 1];

  // Elapsed seconds since the latest round was created
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!latestRound) return;
    const start = new Date(latestRound.createdAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [latestRound]);

  // Simulate step progression based on elapsed time (demo purposes)
  const currentStep = elapsed < 8 ? 0 : elapsed < 25 ? 1 : 2;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const estimatedSeconds = ESTIMATED_MINUTES * 60;
  const progressPct = Math.min((elapsed / estimatedSeconds) * 100, 100);

  const remainingSeconds = Math.max(estimatedSeconds - elapsed, 0);
  const remainingMin = Math.ceil(remainingSeconds / 60);

  if (!latestRound) {
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
      {/* Header */}
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

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-36">
        {/* Timer hero */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative w-32 h-32 mb-4">
            {/* Pulsing ring */}
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

        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-1 mb-8">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;
            const Icon = step.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="flex items-start gap-4 py-3"
              >
                {/* Icon + connector */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                    transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-primary text-primary-foreground'
                        : isActive
                        ? 'bg-primary/20 text-primary ring-2 ring-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`w-0.5 h-8 mt-1 ${
                        isDone ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="pt-2">
                  <p
                    className={`text-sm font-semibold ${
                      isDone || isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order items */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Ronda {latestRound.round}
            </span>
          </div>
          {latestRound.items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-4 py-3 ${
                idx < latestRound.items.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                  {item.quantity}×
                </span>
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border px-4 py-4 z-30">
        <Button
          variant="outline"
          className="w-full h-12 rounded-button text-base font-medium"
          onClick={() => navigate('/guest/menu')}
        >
          Volver al menú
        </Button>
      </div>
    </div>
  );
};

export default OrderTracking;
