import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Gift, ArrowRight } from 'lucide-react';
import { usePaymentStore } from '@/stores/paymentStore';
import { useAuthStore } from '@/stores/authStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';

const QuickPaySuccess = () => {
  const navigate = useNavigate();
  const total = usePaymentStore((s) => s.total);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);

  // Mock points earned from this extra payment
  const pointsEarned = Math.round(total * 0.1);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-6 py-16">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-12 h-12 text-green-600" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-2xl font-semibold text-foreground mb-2 text-center"
      >
        ¡Ajuste pagado!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-muted-foreground text-center mb-8 max-w-[280px]"
      >
        Gracias por completar el pago. La cuenta de la mesa está al corriente.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-card p-5 w-full max-w-[360px] mb-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Monto pagado</span>
          <PriceDisplay amount={total} size="lg" className="font-bold text-foreground" />
        </div>
      </motion.div>

      {/* Loyalty nudge */}
      {isLoggedIn && user ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-card border border-primary/20 rounded-card p-5 w-full max-w-[360px] mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">+{pointsEarned} puntos ganados</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ahora tienes <strong className="text-foreground">{user.loyalty.points + pointsEarned} puntos</strong>.
            {' '}Te faltan {Math.max(user.loyalty.nextRewardAt - user.loyalty.points - pointsEarned, 0)} para tu siguiente recompensa.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <button
            onClick={() => navigate('/guest/login', { state: { nudgeOrigin: 'farewell' } })}
            className="w-full max-w-[360px] p-4 rounded-card border border-primary/20 bg-primary/5 text-left mb-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Pudiste ganar {pointsEarned} puntos</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Crea tu cuenta y acumula puntos en cada visita. <strong className="text-primary">Ahorra $50</strong> al inscribirte.
            </p>
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-[360px]"
      >
        <Button
          variant="outline"
          className="w-full h-12 rounded-button text-sm"
          onClick={() => navigate('/guest/payment-success')}
        >
          Ver estado de la mesa <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
};

export default QuickPaySuccess;
