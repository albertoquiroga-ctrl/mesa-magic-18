import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Users, UtensilsCrossed, RotateCcw } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useTableStore } from '@/stores/tableStore';
import { useCartStore } from '@/stores/cartStore';
import { mockMenuItems } from '@/data/mockData';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';

const MyConsumption = () => {
  const navigate = useNavigate();
  const rounds = useOrderStore((s) => s.rounds);
  const addRound = useOrderStore((s) => s.addRound);
  const guests = useTableStore((s) => s.guests);
  const addItem = useCartStore((s) => s.addItem);
  const { t } = useTranslation();

  const handleReorder = (itemName: string) => {
    const menuItem = mockMenuItems.find((m) => m.name === itemName);
    if (!menuItem) return;
    addItem({ id: menuItem.id, name: menuItem.name, price: menuItem.price });
    toast.success(t('reorder.added', { name: menuItem.name }));
  };

  // Seed round 0 (table orders captured by waiter) if no rounds exist yet.
  // Covers the case where the user ordered offline and wants to pay here.
  useEffect(() => {
    if (rounds.length === 0) {
      addRound({
        id: crypto.randomUUID(),
        round: 0,
        items: [
          { name: 'Guacamole', quantity: 1, price: 95, category: 'Entradas', orderedByDevice: false },
          { name: 'Ensalada Mixta', quantity: 1, price: 130, category: 'Entradas', orderedByDevice: false },
          { name: 'Entrecot a las Brasas', quantity: 1, price: 295, category: 'Platos Fuertes', orderedByDevice: false },
          { name: 'Agua de Jamaica', quantity: 2, price: 65, category: 'Bebidas', orderedByDevice: false },
        ],
        status: 'confirmed',
        createdAt: new Date(Date.now() - 600000).toISOString(),
      });
    }
  }, []);

  const allItems = rounds.flatMap((r) => r.items);
  const sharedItems = allItems.filter((i) => i.category === 'Entradas');
  const myItems = allItems.filter((i) => i.orderedByDevice && i.category !== 'Entradas');
  const othersItems = allItems.filter((i) => !i.orderedByDevice && i.category !== 'Entradas');

  const grandTotal = allItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const myTotal = myItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const othersTotal = othersItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const sharedTotal = sharedItems.reduce((s, i) => s + i.price * i.quantity, 0);

  

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
  const sharedConsolidated = consolidate(sharedItems);

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
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-foreground truncate block">{item.name}</span>
                  {item.category && (
                    <span className="text-[10px] text-muted-foreground">{item.category}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleReorder(item.name)}
                  className="min-w-touch min-h-touch flex items-center justify-center"
                  aria-label={`Pedir ${item.name} otra vez`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-primary" />
                </button>
                <PriceDisplay amount={item.price * item.quantity} size="sm" />
              </div>
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
          <h1 className="text-base font-semibold text-foreground">{t('consumption.title')}</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-36">
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
          t('consumption.myDevice'),
          <Smartphone className="w-3.5 h-3.5 text-primary" />,
          myTotal
        )}

        {/* Shared / al centro items */}
        {renderItemList(
          sharedConsolidated,
          'Típicamente al centro',
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />,
          sharedTotal
        )}

        {/* Others' items */}
        {renderItemList(
          othersConsolidated,
          'Pedido por otros en la mesa',
          <Users className="w-3.5 h-3.5 text-muted-foreground" />,
          othersTotal
        )}
      </div>

      {/* Sticky footer — always visible */}
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
    </div>
  );
};

export default MyConsumption;
