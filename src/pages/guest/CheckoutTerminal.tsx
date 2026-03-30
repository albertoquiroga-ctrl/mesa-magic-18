import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Landmark, Clock } from 'lucide-react';
import { usePaymentStore } from '@/stores/paymentStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const CheckoutTerminal = () => {
  const navigate = useNavigate();
  const total = usePaymentStore((s) => s.total);
  const setStatus = usePaymentStore((s) => s.setStatus);
  const [requested, setRequested] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (requested) {
      const timer = setTimeout(() => setArrived(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [requested]);

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
          <h1 className="text-base font-semibold text-foreground">Terminal en mesa</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
        >
          {arrived ? (
            <Landmark className="w-12 h-12 text-primary" />
          ) : (
            <Clock className="w-12 h-12 text-muted-foreground" />
          )}
        </motion.div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground mb-1">
            {!requested
              ? 'Pago con terminal'
              : arrived
              ? '¡Terminal en camino!'
              : 'Solicitando terminal...'}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {!requested
              ? 'Un mesero llevará la terminal a tu mesa para que pagues con tarjeta.'
              : arrived
              ? 'El mesero llegará en un momento con la terminal.'
              : 'Estamos notificando al mesero más cercano.'}
          </p>
          <div className="bg-card border border-border rounded-card p-4 mb-6">
            <span className="text-xs text-muted-foreground">Total a cobrar</span>
            <PriceDisplay amount={total} size="lg" className="font-bold text-foreground block mt-1" />
          </div>
        </div>

        {!requested ? (
          <Button
            className="w-full max-w-xs h-12 rounded-button text-base font-bold"
            onClick={() => setRequested(true)}
          >
            Solicitar terminal
          </Button>
        ) : arrived ? (
          <Button
            className="w-full max-w-xs h-12 rounded-button text-base font-bold"
            onClick={handleDone}
          >
            Ya pagué
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
            />
            <span className="text-sm">Buscando mesero...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutTerminal;
