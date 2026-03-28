import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import { usePaymentStore } from '@/stores/paymentStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const total = usePaymentStore((s) => s.total);
  const tipAmount = usePaymentStore((s) => s.tipAmount);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRating = () => {
    if (rating > 0) setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-14 h-14 text-green-600" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-[28px] font-semibold text-foreground mb-2"
      >
        ¡Pago exitoso!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-muted-foreground text-center mb-8 max-w-[280px]"
      >
        Tu cuenta ha sido saldada. ¡Gracias por tu visita!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-card p-5 w-full max-w-[320px] mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Pagado</span>
          <PriceDisplay amount={total} size="lg" className="font-bold text-foreground" />
        </div>
        {tipAmount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Propina incluida</span>
            <PriceDisplay amount={tipAmount} size="sm" className="text-muted-foreground" />
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-card p-5 w-full max-w-[320px] mb-8 text-center"
      >
        <p className="text-sm font-medium text-foreground mb-3">
          {submitted ? '¡Gracias por tu opinión!' : '¿Cómo fue tu experiencia?'}
        </p>
        <div className="flex items-center justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={submitted}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-1 transition-transform hover:scale-110 disabled:cursor-default"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredStar || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/30'
                }`}
              />
            </button>
          ))}
        </div>
        {!submitted && rating > 0 && (
          <Button size="sm" variant="outline" onClick={handleSubmitRating} className="rounded-button">
            Enviar
          </Button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="w-full max-w-[320px]"
      >
        <Button
          variant="outline"
          className="w-full h-12 rounded-button text-sm"
          onClick={() => navigate('/guest/menu')}
        >
          Volver al menú <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
