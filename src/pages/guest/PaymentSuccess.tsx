import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ChevronDown, ChevronUp, User, AlertTriangle } from 'lucide-react';
import { usePaymentStore } from '@/stores/paymentStore';
import { useOrderStore } from '@/stores/orderStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';
import { mockGuests } from '@/data/mockData';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const total = usePaymentStore((s) => s.total);
  const tipAmount = usePaymentStore((s) => s.tipAmount);
  const rounds = useOrderStore((s) => s.rounds);
  const [showAudit, setShowAudit] = useState(false);
  const [showUnpaid, setShowUnpaid] = useState(false);

  // Table total from all rounds
  const tableSubtotal = rounds.reduce(
    (sum, r) => sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  // Simulated payments for demo: current user paid `total`, others have mock status
  const guestPayments = mockGuests.map((name, idx) => {
    if (idx === 0) {
      // Current user
      return { name, paid: total, tipPaid: tipAmount, status: 'paid' as const };
    }
    if (idx === 1) {
      // Ana paid her share
      const share = Math.ceil(tableSubtotal / mockGuests.length);
      const tip = Math.round(share * 0.15);
      return { name, paid: share + tip, tipPaid: tip, status: 'paid' as const };
    }
    // Carlos hasn't paid yet
    return { name, paid: 0, tipPaid: 0, status: 'pending' as const };
  });

  const totalPaid = guestPayments.reduce((s, g) => s + g.paid, 0);
  const totalTips = guestPayments.reduce((s, g) => s + g.tipPaid, 0);
  const paidSubtotal = totalPaid - totalTips;
  const remaining = Math.max(tableSubtotal - paidSubtotal, 0);
  const progressPercent = tableSubtotal > 0 ? Math.min((paidSubtotal / tableSubtotal) * 100, 100) : 0;

  // Simulate item payment status for demo
  const allItems = rounds.flatMap((r) => r.items);
  const consolidatedItems = allItems.reduce<{ name: string; quantity: number; price: number; key: string }[]>(
    (acc, item) => {
      const key = `${item.name}::${item.price}`;
      const existing = acc.find((a) => a.key === key);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc.push({ ...item, key });
      }
      return acc;
    },
    []
  );

  // For demo: classify items as fully unpaid, partially paid, or fully paid
  type ItemPaymentStatus = {
    name: string;
    quantity: number;
    price: number;
    totalCost: number;
    paidAmount: number;
    status: 'unpaid' | 'partial' | 'paid';
  };

  const itemPaymentStatuses: ItemPaymentStatus[] = remaining > 0
    ? consolidatedItems.map((item, idx) => {
        const totalCost = item.price * item.quantity;
        // Simulate: first item nobody paid, second item partially paid, rest paid
        if (idx === consolidatedItems.length - 1) {
          return { name: item.name, quantity: item.quantity, price: item.price, totalCost, paidAmount: 0, status: 'unpaid' as const };
        }
        if (idx === consolidatedItems.length - 2 && consolidatedItems.length > 2) {
          const paid = Math.round(totalCost * 0.33);
          return { name: item.name, quantity: item.quantity, price: item.price, totalCost, paidAmount: paid, status: 'partial' as const };
        }
        return { name: item.name, quantity: item.quantity, price: item.price, totalCost, paidAmount: totalCost, status: 'paid' as const };
      })
    : [];

  const unpaidOrPartial = itemPaymentStatuses.filter((i) => i.status !== 'paid');

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-6 py-12">
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
        className="text-muted-foreground text-center mb-6 max-w-[280px]"
      >
        Tu cuenta ha sido saldada. ¡Gracias por tu visita!
      </motion.p>

      {/* Your payment summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-card p-5 w-full max-w-[360px] mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Tu pago</span>
          <PriceDisplay amount={total} size="lg" className="font-bold text-foreground" />
        </div>
        {tipAmount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Propina incluida</span>
            <PriceDisplay amount={tipAmount} size="sm" className="text-muted-foreground" />
          </div>
        )}
      </motion.div>

      {/* Table payment tracker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-card p-5 w-full max-w-[360px] mb-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Estado de la mesa</h3>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Pagado de la cuenta</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                remaining === 0 ? 'bg-green-500' : 'bg-primary'
              }`}
            />
          </div>
        </div>

        {/* Amounts */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Cuenta total de la mesa</span>
            <PriceDisplay amount={tableSubtotal} size="sm" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total pagado (sin propinas)</span>
            <PriceDisplay amount={paidSubtotal} size="sm" className="text-foreground" />
          </div>
          {remaining > 0 && (
            <>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border">
                <span className="font-medium text-destructive">Falta por pagar</span>
                <PriceDisplay amount={remaining} size="sm" className="font-semibold text-destructive" />
              </div>

              {/* Unpaid items breakdown */}
              <button
                onClick={() => setShowUnpaid((v) => !v)}
                className="flex items-center gap-1.5 w-full pt-2 text-[11px] font-medium text-destructive"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Ver platillos pendientes</span>
                {showUnpaid ? (
                  <ChevronUp className="w-3 h-3 ml-auto" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-auto" />
                )}
              </button>
              {showUnpaid && (
                <div className="mt-1.5 rounded-lg border border-destructive/20 bg-destructive/5 overflow-hidden">
                  {unpaidOrPartial.map((item, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-2.5 ${
                        idx < unpaidOrPartial.length - 1 ? 'border-b border-destructive/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[11px] font-mono text-muted-foreground w-4 shrink-0">
                            {item.quantity}×
                          </span>
                          <span className="text-xs text-foreground truncate">{item.name}</span>
                        </div>
                        <PriceDisplay amount={item.totalCost} size="sm" className="text-muted-foreground" />
                      </div>
                      {item.status === 'unpaid' ? (
                        <div className="flex items-center gap-1.5 mt-1.5 ml-6">
                          <div className="flex-1 h-1.5 bg-muted rounded-full" />
                          <span className="text-[10px] font-medium text-destructive">
                            Nadie lo pagó — $0 / ${item.totalCost}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-1.5 ml-6">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${(item.paidAmount / item.totalCost) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-yellow-600">
                            Parcial — ${item.paidAmount} / ${item.totalCost}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {remaining === 0 && (
            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border">
              <span className="font-medium text-green-600">✓ Cuenta saldada</span>
            </div>
          )}
        </div>

        {/* Audit toggle */}
        <button
          onClick={() => setShowAudit((v) => !v)}
          className="flex items-center justify-between w-full py-2 text-xs font-medium text-foreground"
        >
          <span>Desglose por comensal</span>
          {showAudit ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {showAudit && (
          <div className="space-y-2 pt-1">
            {guestPayments.map((guest) => (
              <div
                key={guest.name}
                className={`flex items-center justify-between p-2.5 rounded-lg border ${
                  guest.status === 'paid'
                    ? 'border-green-200 bg-green-50'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    guest.status === 'paid' ? 'bg-green-100' : 'bg-muted'
                  }`}>
                    <User className={`w-3.5 h-3.5 ${
                      guest.status === 'paid' ? 'text-green-600' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-foreground">{guest.name}</span>
                    {guest.status === 'paid' && guest.tipPaid > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        Propina: ${guest.tipPaid}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {guest.status === 'paid' ? (
                    <div>
                      <PriceDisplay amount={guest.paid} size="sm" className="font-semibold text-green-700" />
                      <p className="text-[10px] text-green-600">✓ Pagado</p>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Pendiente</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Back to menu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="w-full max-w-[360px]"
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
