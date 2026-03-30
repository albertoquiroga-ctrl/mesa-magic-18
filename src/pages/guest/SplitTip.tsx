import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, User, ChevronDown, ChevronUp, Scissors, Minus, Plus } from 'lucide-react';
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
  const {
    splitMode, setSplitMode, tipPercent, setTipPercent,
    setTipAmount, setTotal, itemAssignments, setItemAssignment, resetAssignments,
  } = usePaymentStore();

  const [customTip, setCustomTip] = useState('');
  const [isCustomTip, setIsCustomTip] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

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

  const subtotal = rounds.reduce(
    (sum, r) => sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  const guestCount = mockGuests.length;

  // Calculate perPerson based on split mode
  let perPerson: number;
  let mineTotal = 0;
  let sharedTotal = 0;

  if (splitMode === 'custom') {
    consolidatedItems.forEach((item) => {
      const assignment = itemAssignments[item.key] || 'shared';
      const itemTotal = item.price * item.quantity;
      if (assignment === 'mine') {
        mineTotal += itemTotal;
      } else if (assignment === 'shared') {
        sharedTotal += itemTotal;
      }
      // 'none' → no se suma
    });
    perPerson = mineTotal + Math.ceil(sharedTotal / guestCount);
  } else if (splitMode === 'full') {
    perPerson = subtotal;
  } else {
    perPerson = Math.ceil(subtotal / guestCount);
  }

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

  const handleSplitModeChange = (mode: 'full' | 'equal' | 'custom') => {
    setSplitMode(mode);
    if (mode === 'custom') {
      resetAssignments();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
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
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSplitModeChange('full')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-card border transition-colors ${
                splitMode === 'full' ? 'border-primary bg-primary/5' : 'border-border bg-card'
              }`}
            >
              <User className={`w-5 h-5 ${splitMode === 'full' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-medium ${splitMode === 'full' ? 'text-primary' : 'text-foreground'}`}>
                Pago total
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight text-center">Tú pagas todo</span>
            </button>
            <button
              onClick={() => handleSplitModeChange('equal')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-card border transition-colors ${
                splitMode === 'equal' ? 'border-primary bg-primary/5' : 'border-border bg-card'
              }`}
            >
              <Users className={`w-5 h-5 ${splitMode === 'equal' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-medium ${splitMode === 'equal' ? 'text-primary' : 'text-foreground'}`}>
                Dividir
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight text-center">
                Entre {guestCount}
              </span>
            </button>
            <button
              onClick={() => handleSplitModeChange('custom')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-card border transition-colors ${
                splitMode === 'custom' ? 'border-primary bg-primary/5' : 'border-border bg-card'
              }`}
            >
              <Scissors className={`w-5 h-5 ${splitMode === 'custom' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-medium ${splitMode === 'custom' ? 'text-primary' : 'text-foreground'}`}>
                Pago justo
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight text-center">Tus platillos</span>
            </button>
          </div>
        </section>

        {/* Fair pay item assignment */}
        {splitMode === 'custom' && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Marca tus platillos
            </h2>
            <div className="bg-card border border-border rounded-card overflow-hidden">
              {consolidatedItems.map((item, idx) => {
                const assignment = itemAssignments[item.key] || 'shared';
                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between px-3 py-2.5 gap-2 ${
                      idx < consolidatedItems.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                        {item.quantity}×
                      </span>
                      <span className="text-sm text-foreground truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <PriceDisplay amount={item.price * item.quantity} size="sm" />
                      <div className="flex rounded-full border border-border overflow-hidden ml-1">
                        {([
                          { value: 'mine', label: 'Mío' },
                          { value: 'shared', label: 'Compartido' },
                          { value: 'none', label: 'No pago' },
                        ] as const).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setItemAssignment(item.key, opt.value)}
                            className={`px-2 py-1 text-[11px] font-medium transition-colors ${
                              assignment === opt.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card text-muted-foreground'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Summary */}
              <div className="px-3 py-2.5 bg-muted/50 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tus platillos</span>
                  <PriceDisplay amount={mineTotal} size="sm" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Compartidos ÷ {guestCount}</span>
                  <PriceDisplay amount={Math.ceil(sharedTotal / guestCount)} size="sm" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Order breakdown (for non-custom modes) */}
        {splitMode !== 'custom' && (
          <section className="mb-6">
            <button
              onClick={() => setShowBreakdown((v) => !v)}
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground"
            >
              <span>Desglose del pedido</span>
              {showBreakdown ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {showBreakdown && (
              <div className="bg-card border border-border rounded-card overflow-hidden mt-2">
                {consolidatedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-4 py-2.5 ${
                      idx < consolidatedItems.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                        {item.quantity}×
                      </span>
                      <span className="text-sm text-foreground truncate">{item.name}</span>
                    </div>
                    <PriceDisplay amount={item.price * item.quantity} size="sm" />
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                  <span className="text-xs text-muted-foreground">Subtotal mesa</span>
                  <PriceDisplay amount={subtotal} size="sm" className="font-semibold" />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Subtotal display */}
        <div className="flex items-center justify-between py-3 border-b border-border mb-6">
          <span className="text-sm text-muted-foreground">
            {splitMode === 'full' ? 'Total mesa' : splitMode === 'custom' ? 'Tu subtotal' : 'Tu parte'}
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
