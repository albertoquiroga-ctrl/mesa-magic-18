import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt, Smartphone, Users, UtensilsCrossed } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useTableStore } from '@/stores/tableStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';

const MyConsumption = () => {
  const navigate = useNavigate();
  const rounds = useOrderStore((s) => s.rounds);
  const guests = useTableStore((s) => s.guests);

  const allItems = rounds.flatMap((r) => r.items);
  const sharedItems = allItems.filter((i) => i.category === 'Entradas');
  const myItems = allItems.filter((i) => i.orderedByDevice && i.category !== 'Entradas');
  const othersItems = allItems.filter((i) => !i.orderedByDevice && i.category !== 'Entradas');

  const grandTotal = allItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const myTotal = myItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const othersTotal = othersItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const isEmpty = rounds.length === 0;

  const consolidate = (items: typeof allItems) => {
    const map: Record<string, { name: string; quantity: number; price: number; category?: string }> = {};
    items.forEach((i) => {
      const key = `${i.name}::${i.price}`;
      if (map[key]) {
        map[key].quantity += i.quantity;
      } else {
        map[key] = { name: i.name, quantity: i.quantity, price: i.price, category: i.category };
      }
    });
    return Object.values(map);
  };

  const myConsolidated = consolidate(myItems);
  const othersConsolidated = consolidate(othersItems);

  const renderItemList = (items: ReturnType<typeof consolidate>, label: string, icon: React.ReactNode, total: number) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className="bg-card border border-border rounded-card overflow-hidden">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-4 py-3 ${
                idx < items.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
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
              <PriceDisplay amount={item.price * item.quantity} size="sm" />
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
            <span className="text-xs text-muted-foreground">Subtotal</span>
            <PriceDisplay amount={total} size="sm" className="font-semibold" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate('/guest/menu')}
            className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">Mi consumo</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-36">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Aún no has pedido nada</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/guest/menu')}>
              Ir al menú
            </Button>
          </div>
        ) : (
          <>
            {/* Guests summary */}
            <div className="flex gap-2 mb-4">
              {guests.map((g) => (
                <span
                  key={g.id}
                  className={`text-xs px-3 py-1.5 rounded-chip font-medium ${
                    g.isCurrentUser
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* My device items */}
            {renderItemList(
              myConsolidated,
              'Pedido desde tu dispositivo',
              <Smartphone className="w-3.5 h-3.5 text-primary" />,
              myTotal
            )}

            {/* Others' items */}
            {renderItemList(
              othersConsolidated,
              'Pedido por otros en la mesa',
              <Users className="w-3.5 h-3.5 text-muted-foreground" />,
              othersTotal
            )}
          </>
        )}
      </div>

      {/* Sticky footer */}
      {!isEmpty && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border px-4 py-4 z-30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total consumo</span>
            <PriceDisplay amount={grandTotal} size="lg" className="font-bold text-foreground" />
          </div>
          <Button
            className="w-full h-12 rounded-button text-base font-bold"
            onClick={() => navigate('/guest/split-tip')}
          >
            Pedir la cuenta
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyConsumption;
