import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';
import { mockGuests } from '@/data/mockData';

const MyConsumption = () => {
  const navigate = useNavigate();
  const rounds = useOrderStore((s) => s.rounds);

  const grandTotal = rounds.reduce(
    (sum, r) => sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  const isEmpty = rounds.length === 0;

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
              {mockGuests.map((g) => (
                <span
                  key={g}
                  className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-chip font-medium"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Rounds */}
            {rounds.map((round) => {
              const roundTotal = round.items.reduce((s, i) => s + i.price * i.quantity, 0);
              return (
                <div key={round.id} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Ronda {round.round}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-chip font-medium ${
                        round.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : round.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {round.status === 'confirmed'
                        ? 'Confirmada'
                        : round.status === 'rejected'
                        ? 'Rechazada'
                        : 'Pendiente'}
                    </span>
                  </div>
                  <div className="bg-card border border-border rounded-card overflow-hidden">
                    {round.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-4 py-3 ${
                          idx < round.items.length - 1 ? 'border-b border-border' : ''
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
                      <span className="text-xs text-muted-foreground">Subtotal ronda</span>
                      <PriceDisplay amount={roundTotal} size="sm" className="font-semibold" />
                    </div>
                  </div>
                </div>
              );
            })}
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
