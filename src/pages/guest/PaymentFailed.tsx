import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6"
      >
        <XCircle className="w-14 h-14 text-red-600" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-[28px] font-semibold text-foreground mb-2"
      >
        Pago no procesado
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-muted-foreground text-center mb-8 max-w-[280px]"
      >
        Hubo un problema con tu tarjeta. Intenta de nuevo o usa otro método de pago.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-[320px] space-y-3"
      >
        <Button
          className="w-full h-12 rounded-button text-base font-bold"
          onClick={() => navigate('/guest/checkout/card', { replace: true })}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Intentar de nuevo
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 rounded-button text-sm"
          onClick={() => navigate('/guest/split-tip')}
        >
          Cambiar método de pago
        </Button>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
