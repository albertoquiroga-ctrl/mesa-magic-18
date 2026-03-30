import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Banknote, MapPin } from 'lucide-react';
import { usePaymentStore } from '@/stores/paymentStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { useSessionStore } from '@/stores/sessionStore';
import { Button } from '@/components/ui/button';

const CheckoutCash = () => {
  const navigate = useNavigate();
  const total = usePaymentStore((s) => s.total);
  const setStatus = usePaymentStore((s) => s.setStatus);

  const handleDone = () => {
    setStatus('success');
    navigate('/guest/payment-success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate('/guest/split-tip')}
            className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">Pago en efectivo</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Banknote className="w-12 h-12 text-primary" />
        </motion.div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground mb-1">Paga en caja</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Dirígete a la caja del restaurante para realizar tu pago en efectivo.
          </p>

          <div className="bg-card border border-border rounded-card p-4 mb-4">
            <span className="text-xs text-muted-foreground">Total a pagar</span>
            <PriceDisplay amount={total} size="lg" className="font-bold text-foreground block mt-1" />
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-xs">Menciona tu mesa al llegar a caja</span>
          </div>
        </div>

        <Button
          className="w-full max-w-xs h-12 rounded-button text-base font-bold"
          onClick={handleDone}
        >
          Ya pagué
        </Button>
      </div>
    </div>
  );
};

export default CheckoutCash;
