import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePaymentStore } from '@/stores/paymentStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';

const QuickPay = () => {
  const navigate = useNavigate();
  const { total, setStatus, incrementAttempt } = usePaymentStore();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const isValid = cardNumber.replace(/\s/g, '').length >= 1;

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    incrementAttempt();
    setStatus('success');
    navigate('/guest/quick-pay-success', { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate('/guest/payment-success')}
            className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">Pago de ajuste</h1>
          <Lock className="w-4 h-4 text-muted-foreground ml-auto" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-36">
        {/* Amount */}
        <div className="bg-card border border-border rounded-card p-5 mb-6 text-center">
          <p className="text-xs text-muted-foreground mb-1">Monto a pagar</p>
          <PriceDisplay amount={total} size="lg" className="text-2xl font-bold text-foreground" />
          <p className="text-[11px] text-muted-foreground mt-2">
            Ajuste por platillos faltantes en la cuenta
          </p>
        </div>

        {/* Card form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Nombre en la tarjeta
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como aparece en tu tarjeta"
              className="w-full h-12 rounded-input bg-card border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Número de tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className="w-full h-12 rounded-input bg-card border border-border px-4 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Vencimiento
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/AA"
                className="w-full h-12 rounded-input bg-card border border-border px-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">CVV</label>
              <input
                type="text"
                inputMode="numeric"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                className="w-full h-12 rounded-input bg-card border border-border px-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Pago simulado — no se realizará ningún cobro real.</span>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border px-4 py-4 z-30">
        <Button
          className="w-full h-12 rounded-button text-base font-bold"
          disabled={!isValid || processing}
          onClick={handlePay}
        >
          {processing ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
              Procesando...
            </motion.span>
          ) : (
            <>Pagar <span className="font-mono ml-1">${total} MXN</span></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuickPay;
