import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, User, ChevronDown, ChevronUp, Scissors, Minus, Plus, Gift, Smartphone, UtensilsCrossed, CreditCard, Landmark, Banknote } from 'lucide-react';
import { usePaymentStore } from '@/stores/paymentStore';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';
import { useTableStore } from '@/stores/tableStore';
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
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isNewUser = useAuthStore((s) => s.isNewUser);
  const {
    splitMode, setSplitMode, tipPercent, setTipPercent,
    setTipAmount, setTotal, setPaymentMethod, itemAssignments, setItemAssignment,
    sharedAmong, setSharedAmong, resetAssignments,
  } = usePaymentStore();

  const [customTip, setCustomTip] = useState('');
  const [isCustomTip, setIsCustomTip] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const guests = useTableStore((s) => s.guests);
  const guestCount = guests.length;

  const allItems = rounds.flatMap((r) => r.items);
  const consolidatedItems = allItems.reduce<{ name: string; quantity: number; price: number; key: string; category?: string; orderedByDevice?: boolean }[]>(
    (acc, item) => {
      const key = `${item.name}::${item.price}`;
      const existing = acc.find((a) => a.key === key);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc.push({ name: item.name, quantity: item.quantity, price: item.price, key, category: item.category, orderedByDevice: item.orderedByDevice });
      }
      return acc;
    },
    []
  );

  const alCentroItems = consolidatedItems.filter((i) => i.category === 'Entradas');
  const myDeviceItems = consolidatedItems.filter((i) => i.orderedByDevice && i.category !== 'Entradas');
  const othersItems = consolidatedItems.filter((i) => !i.orderedByDevice && i.category !== 'Entradas');

  // Auto-assign on custom mode switch
  useEffect(() => {
    if (splitMode === 'custom') {
      consolidatedItems.forEach((item) => {
        if (item.category === 'Entradas') {
          setItemAssignment(item.key, 'shared');
          setSharedAmong(item.key, guestCount);
        } else if (item.orderedByDevice) {
          setItemAssignment(item.key, 'mine');
        } else {
          setItemAssignment(item.key, 'none');
        }
      });
    }
  }, [splitMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = rounds.reduce(
    (sum, r) => sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  // guestCount already defined above

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
        const divisor = sharedAmong[item.key] || guestCount;
        sharedTotal += Math.ceil(itemTotal / divisor);
      }
    });
    perPerson = mineTotal + sharedTotal;
  } else if (splitMode === 'full') {
    perPerson = subtotal;
  } else {
    perPerson = Math.ceil(subtotal / guestCount);
  }

  const tipAmount = isLowRating
    ? 0
    : isCustomTip
      ? Number(customTip) || 0
      : Math.round(perPerson * (tipPercent / 100));
  const activeTip = isCustomTip ? Number(customTip) || 0 : tipPercent;

  const loyaltyDiscount = isLoggedIn && isNewUser ? 50 : 0;

  const finalTotal = Math.max(perPerson + tipAmount - loyaltyDiscount, 0);

  const canContinue = isUnlocked && (!isLowRating || feedback.trim().length > 0);

  const [selectedPayMethod, setSelectedPayMethod] = useState<'card' | 'terminal' | 'cash'>('card');

  const handleContinue = () => {
    if (!canContinue) return;
    setTipAmount(tipAmount);
    setTotal(finalTotal);
    setPaymentMethod(selectedPayMethod);
    if (selectedPayMethod === 'card') {
      navigate('/guest/checkout/card');
    } else if (selectedPayMethod === 'terminal') {
      navigate('/guest/checkout/terminal');
    } else {
      navigate('/guest/checkout/cash');
    }
  };

  const handleSplitModeChange = (mode: 'full' | 'equal' | 'custom') => {
    setSplitMode(mode);
    if (mode === 'custom') {
      resetAssignments();
    }
  };

  const renderItemRow = (item: typeof consolidatedItems[0], idx: number, totalCount: number) => {
    const assignment = itemAssignments[item.key] || 'shared';
    const divisor = sharedAmong[item.key] || guestCount;
    return (
      <div
        key={item.key}
        className={`px-3 py-2.5 ${idx < totalCount - 1 ? 'border-b border-border' : ''}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
              {item.quantity}×
            </span>
            <div className="min-w-0">
              <span className="text-sm text-foreground truncate block">{item.name}</span>
              {item.category && (
                <span className="text-[10px] text-muted-foreground">{item.category}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {assignment === 'shared' ? (
              <span className="text-[11px] font-mono text-muted-foreground">
                ${item.price * item.quantity} ÷ {divisor} = <span className="text-foreground font-semibold">${Math.ceil((item.price * item.quantity) / divisor)}</span>
              </span>
            ) : (
              <PriceDisplay amount={item.price * item.quantity} size="sm" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 ml-7">
          <div className="flex rounded-full border border-border overflow-hidden">
            {([
              { value: 'mine', label: 'Mío' },
              { value: 'shared', label: 'Compartido' },
              { value: 'none', label: 'No pago' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setItemAssignment(item.key, opt.value)}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  assignment === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {assignment === 'shared' && (
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => setSharedAmong(item.key, Math.max(2, divisor - 1))}
                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                aria-label="Menos personas"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono text-xs w-4 text-center tabular-nums">{divisor}</span>
              <button
                onClick={() => setSharedAmong(item.key, divisor + 1)}
                className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                aria-label="Más personas"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
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

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-52">
        {/* Rating section — always visible */}
        <section className="mb-6">
          <div className="bg-card border border-border rounded-card p-5 text-center">
            <h2 className="text-sm font-semibold text-foreground mb-1">
              ¿Cómo fue tu experiencia?
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Califica para continuar con el pago
            </p>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {rating <= 2 ? 'Lamentamos escuchar eso' : rating <= 4 ? '¡Gracias!' : '¡Excelente!'}
              </p>
            )}
          </div>
        </section>

        {/* Rest of page — greyed out if not unlocked */}
        <div className={!isUnlocked ? 'opacity-40 pointer-events-none select-none' : ''}>
          {!isUnlocked && (
            <p className="text-center text-xs text-muted-foreground mb-4">
              Califica tu experiencia para desbloquear el pago
            </p>
          )}

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

              {/* My device items */}
              {myDeviceItems.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                      Pedido desde tu dispositivo
                    </span>
                  </div>
                  <div className="bg-card border border-primary/20 rounded-card overflow-hidden">
                    {myDeviceItems.map((item, idx) => renderItemRow(item, idx, myDeviceItems.length))}
                  </div>
                </div>
              )}

              {/* Al centro items */}
              {alCentroItems.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide">
                      Típicamente al centro
                    </span>
                  </div>
                  <div className="bg-card border border-amber-200 rounded-card overflow-hidden">
                    {alCentroItems.map((item, idx) => renderItemRow(item, idx, alCentroItems.length))}
                  </div>
                </div>
              )}

              {/* Others' items */}
              {othersItems.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Pedido por otros en la mesa
                    </span>
                  </div>
                  <div className="bg-card border border-border rounded-card overflow-hidden">
                    {othersItems.map((item, idx) => renderItemRow(item, idx, othersItems.length))}
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-card px-3 py-2.5 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tus platillos</span>
                  <PriceDisplay amount={mineTotal} size="sm" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tu parte de compartidos</span>
                  <PriceDisplay amount={sharedTotal} size="sm" />
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
                <div className="mt-2 space-y-3">
                  {/* My device items */}
                  {myDeviceItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Smartphone className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Tu dispositivo</span>
                      </div>
                      <div className="bg-card border border-primary/20 rounded-card overflow-hidden">
                        {myDeviceItems.map((item, idx) => (
                          <div key={idx} className={`flex items-center justify-between px-4 py-2.5 ${idx < myDeviceItems.length - 1 ? 'border-b border-border' : ''}`}>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{item.quantity}×</span>
                              <span className="text-sm text-foreground truncate">{item.name}</span>
                            </div>
                            <PriceDisplay amount={item.price * item.quantity} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Al centro items */}
                  {alCentroItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <UtensilsCrossed className="w-3 h-3 text-amber-600" />
                        <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Típicamente al centro</span>
                      </div>
                      <div className="bg-card border border-amber-200 rounded-card overflow-hidden">
                        {alCentroItems.map((item, idx) => (
                          <div key={idx} className={`flex items-center justify-between px-4 py-2.5 ${idx < alCentroItems.length - 1 ? 'border-b border-border' : ''}`}>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{item.quantity}×</span>
                              <span className="text-sm text-foreground truncate">{item.name}</span>
                            </div>
                            <PriceDisplay amount={item.price * item.quantity} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Others' items */}
                  {othersItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Otros en la mesa</span>
                      </div>
                      <div className="bg-card border border-border rounded-card overflow-hidden">
                        {othersItems.map((item, idx) => (
                          <div key={idx} className={`flex items-center justify-between px-4 py-2.5 ${idx < othersItems.length - 1 ? 'border-b border-border' : ''}`}>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{item.quantity}×</span>
                              <span className="text-sm text-foreground truncate">{item.name}</span>
                            </div>
                            <PriceDisplay amount={item.price * item.quantity} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-card border border-border rounded-card flex items-center justify-between px-4 py-2.5">
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

          {/* Tip or feedback section */}
          {isLowRating ? (
            <section>
              <div className="bg-card border border-destructive/30 rounded-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-destructive" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Lamentamos tu experiencia
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Nos importa mucho mejorar. Por favor cuéntanos qué salió mal para poder corregirlo.
                </p>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="¿Cómo podemos mejorar?"
                  className="min-h-[80px] text-sm resize-none"
                />
                {feedback.trim().length === 0 && (
                  <p className="text-[11px] text-destructive mt-2">
                    Este campo es obligatorio para continuar
                  </p>
                )}
              </div>
            </section>
          ) : (
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
          )}

          {/* Payment method selection */}
          <section className="mb-6 mt-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Método de pago
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedPayMethod('card')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-card border transition-colors ${
                  selectedPayMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${selectedPayMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${selectedPayMethod === 'card' ? 'text-primary' : 'text-foreground'}`}>
                  Tarjeta
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight text-center">Pago en app</span>
              </button>
              <button
                onClick={() => setSelectedPayMethod('terminal')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-card border transition-colors ${
                  selectedPayMethod === 'terminal' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <Landmark className={`w-5 h-5 ${selectedPayMethod === 'terminal' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${selectedPayMethod === 'terminal' ? 'text-primary' : 'text-foreground'}`}>
                  Terminal
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight text-center">En tu mesa</span>
              </button>
              <button
                onClick={() => setSelectedPayMethod('cash')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-card border transition-colors ${
                  selectedPayMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <Banknote className={`w-5 h-5 ${selectedPayMethod === 'cash' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${selectedPayMethod === 'cash' ? 'text-primary' : 'text-foreground'}`}>
                  Efectivo
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight text-center">Pago en caja</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border px-4 py-4 z-30">
        {!isLoggedIn && isUnlocked ? (
          <button
            onClick={() => navigate('/guest/login', { state: { returnTo: '/guest/split-tip', nudgeOrigin: 'split-tip' } })}
            className="flex items-center gap-2 w-full p-2.5 mb-3 rounded-lg bg-primary/5 border border-primary/20 text-left"
          >
            <Gift className="w-4 h-4 text-primary shrink-0" />
            <span className="text-[11px] text-muted-foreground">
              <strong className="text-foreground">Gana puntos</strong> por esta compra — inicia sesión
            </span>
          </button>
        ) : isLoggedIn && isUnlocked ? (
          <div className="flex items-center gap-2 w-full p-2.5 mb-3 rounded-lg bg-green-50 border border-green-200 text-left">
            <Gift className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-[11px] text-muted-foreground">
              Ganarás <strong className="text-green-700">+{Math.round(finalTotal * 0.1)} puntos</strong> con esta compra ⭐
            </span>
          </div>
        ) : null}
        {loyaltyDiscount > 0 && (
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-medium text-green-700">🎁 Descuento de bienvenida</span>
            <span className="text-xs font-semibold text-green-700">-${ loyaltyDiscount }</span>
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total a pagar</span>
          <div className="flex items-center gap-2">
            {loyaltyDiscount > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                ${perPerson + tipAmount}
              </span>
            )}
            <PriceDisplay amount={finalTotal} size="lg" className="font-bold text-foreground" />
          </div>
        </div>
        <Button
          className="w-full h-12 rounded-button text-base font-bold"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {selectedPayMethod === 'card' ? 'Continuar al pago' : selectedPayMethod === 'terminal' ? 'Solicitar terminal' : 'Pagar en caja'}
        </Button>
      </div>
    </div>
  );
};

export default SplitTip;
