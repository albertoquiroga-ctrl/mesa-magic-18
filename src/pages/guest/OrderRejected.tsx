/**
 * OrderRejected
 *
 * Shown when the kitchen rejects one or more items from a round.
 * Displays the rejection reason and the affected items, then lets the
 * guest either modify their order (go back to menu) or accept and continue.
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ChefHat, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/orderStore';
import { useMemo } from 'react';

// ---------------------------------------------------------------------------
// Rejection reasons — in production these would come from the API
// ---------------------------------------------------------------------------

type RejectionReason = 'unavailable' | 'kitchen_closed' | 'out_of_stock' | 'other';

const REASON_LABELS: Record<RejectionReason, { title: string; description: string; icon: typeof ChefHat }> = {
  unavailable: {
    title: 'Platillo no disponible',
    description: 'Uno o más platillos ya no están disponibles en este momento.',
    icon: UtensilsCrossed,
  },
  kitchen_closed: {
    title: 'Cocina cerrada',
    description: 'La cocina ha cerrado para nuevos pedidos de esta categoría.',
    icon: ChefHat,
  },
  out_of_stock: {
    title: 'Ingredientes agotados',
    description: 'Los ingredientes necesarios se han agotado por hoy.',
    icon: UtensilsCrossed,
  },
  other: {
    title: 'Orden rechazada',
    description: 'La cocina no pudo procesar tu pedido en este momento.',
    icon: XCircle,
  },
};

const OrderRejected = () => {
  const navigate = useNavigate();
  const rounds = useOrderStore((s) => s.rounds);

  // Find the most recent rejected round
  const rejectedRound = useMemo(
    () => [...rounds].reverse().find((r) => r.status === 'rejected'),
    [rounds],
  );

  // Demo fallback: if no rejected round exists, show a generic state
  const reason: RejectionReason = 'unavailable';
  const { title, description, icon: ReasonIcon } = REASON_LABELS[reason];

  const rejectedItems = rejectedRound?.items ?? [
    { name: 'Mezcal Oaxaqueño', quantity: 1, price: 95 },
    { name: 'Pasta con Trufa', quantity: 1, price: 245 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 pt-6 pb-32">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center mb-6"
        aria-label="Volver"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5"
      >
        <ReasonIcon className="w-10 h-10 text-destructive" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-heading text-[24px] font-semibold text-center"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-muted-foreground text-center mt-2 mb-6 max-w-[300px] mx-auto text-sm leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Rejected items list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-card p-4 space-y-3 mb-6"
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Platillos rechazados
        </p>
        {rejectedItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Cant: {item.quantity}
              </p>
            </div>
            <p className="font-mono text-sm text-muted-foreground tabular-nums ml-3">
              ${item.price * item.quantity}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Info note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-xs text-muted-foreground text-center leading-relaxed mb-8"
      >
        No se te ha cobrado nada por estos platillos.
        Puedes elegir otros del menú o continuar sin ellos.
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="space-y-3 max-w-[320px] mx-auto w-full"
      >
        <Button
          className="w-full h-12 rounded-button text-base font-bold"
          onClick={() => navigate('/guest/menu', { replace: true })}
        >
          Elegir otra cosa
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 rounded-button text-sm"
          onClick={() => navigate('/guest/order-tracking', { replace: true })}
        >
          Continuar sin cambios
        </Button>
      </motion.div>
    </div>
  );
};

export default OrderRejected;
