import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, User, ChevronDown, ChevronUp } from 'lucide-react';
import { usePaymentStore } from '@/stores/paymentStore';
import { useOrderStore } from '@/stores/orderStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';
import { mockGuests } from '@/data/mockData';

const tipOptions = [
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
  { label: '20%', value: 20 },
];

const SplitTip = () => {
  const navigate = useNavigate();
  const rounds = useOrderStore((s) => s.rounds);
  const { splitMode, setSplitMode, tipPercent, setTipPercent, setTipAmount, setTotal } =
    usePaymentStore();

  const [customTip, setCustomTip] = useState('');
  const [isCustomTip, setIsCustomTip] = useState(false);

  const subtotal = rounds.reduce(
    (sum, r) => sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  const guestCount = mockGuests.length;
  const perPerson = splitMode === 'full' ? subtotal : Math.ceil(subtotal / guestCount);

  const activeTip = isCustomTip ? Number(customTip) || 0 : tipPercent;
  const tipAmount = isCustomTip
    ? Number(customTip) || 0
    : Math.round(perPerson * (tipPercent / 100));
  const finalTotal = perPerson + tipAmount;

  const handleContinue = () => {
    setTipAmount(tipAmount);
    setTotal(finalTotal);
    navigate('/guest/checkout/card');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate('/guest/my-consumption')}
            className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">Dividir y propina</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-36">
        {/* Split mode */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            ¿Cómo pagar?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSplitMode('full')}
              className={`flex flex-col items-center gap-2 p-4 rounded-card border transition-colors ${
                splitMode === 'full'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <User className={`w-6 h-6 ${splitMode === 'full' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${splitMode === 'full' ? 'text-primary' : 'text-foreground'}`}>
                Pago total
              </span>
              <span className="text-xs text-muted-foreground">Tú pagas todo</span>
            </button>
            <button
              onClick={() => setSplitMode('equal')}
              className={`flex flex-col items-center gap-2 p-4 rounded-card border transition-colors ${
                splitMode === 'equal'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
              }`}
            >
              <Users className={`w-6 h-6 ${splitMode === 'equal' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${splitMode === 'equal' ? 'text-primary' : 'text-foreground'}`}>
                Dividir
              </span>
              <span className="text-xs text-muted-foreground">
                Entre {guestCount} personas
              </span>
            </button>
          </div>
        </section>

        {/* Subtotal display */}
        <div className="flex items-center justify-between py-3 border-b border-border mb-6">
          <span className="text-sm text-muted-foreground">
            {splitMode === 'full' ? 'Total mesa' : 'Tu parte'}
          </span>
          <PriceDisplay amount={perPerson} size="md" className="font-semibold text-foreground" />
        </div>

        {/* Tip selector */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Propina
          </h2>
          <div className="flex gap-2 mb-3">
            {tipOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setTipPercent(opt.value);
                  setIsCustomTip(false);
                }}
                className={`flex-1 py-3 rounded-button text-sm font-semibold transition-colors ${
                  !isCustomTip && tipPercent === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              onClick={() => setIsCustomTip(true)}
              className={`flex-1 py-3 rounded-button text-sm font-semibold transition-colors ${
                isCustomTip
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Otro
            </button>
          </div>

          {isCustomTip && (
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="number"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder="0"
                className="w-full h-12 rounded-input bg-card border border-border pl-8 pr-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">
              Propina{!isCustomTip ? ` (${activeTip}%)` : ''}
            </span>
            <PriceDisplay amount={tipAmount} size="sm" className="text-foreground" />
          </div>
        </section>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border px-4 py-4 z-30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total a pagar</span>
          <PriceDisplay amount={finalTotal} size="lg" className="font-bold text-foreground" />
        </div>
        <Button
          className="w-full h-12 rounded-button text-base font-bold"
          onClick={handleContinue}
        >
          Continuar al pago
        </Button>
      </div>
    </div>
  );
};

export default SplitTip;
