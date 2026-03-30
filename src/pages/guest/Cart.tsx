import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import OrderTracking from './OrderTracking';

const Cart = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const addRound = useOrderStore((s) => s.addRound);
  const rounds = useOrderStore((s) => s.rounds);
  const currentRound = useOrderStore((s) => s.currentRound);
  const setCurrentRound = useOrderStore((s) => s.setCurrentRound);
  const [sent, setSent] = useState(false);

  const total = getTotal();
  const isEmpty = items.length === 0;
  const hasActiveOrder = rounds.length > 0;

  const handleSend = () => {
    if (isEmpty) return;
    addRound({
      id: crypto.randomUUID(),
      round: currentRound,
      items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setCurrentRound(currentRound + 1);
    clearCart();
    setSent(true);
    setTimeout(() => setSent(false), 1800);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <ShoppingBag className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-foreground"
        >
          ¡Orden enviada!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground text-center"
        >
          Tu mesero la recibirá en un momento.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate('/guest/menu')}
            className="min-w-touch min-h-touch flex items-center justify-center -ml-2"
            aria-label="Volver al menú"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">Tu pedido</h1>
          {!isEmpty && (
            <span className="ml-auto text-xs text-muted-foreground font-mono tabular-nums">
              {items.length} producto{items.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-36">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/guest/menu')}>
              Explorar menú
            </Button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 py-3 border-b border-border"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <PriceDisplay amount={item.price} size="sm" className="text-muted-foreground" />
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">📝 {item.notes}</p>
                  )}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() =>
                      item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)
                    }
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center min-w-touch min-h-touch"
                    aria-label="Quitar uno"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-foreground" />
                    )}
                  </button>
                  <span className="font-mono text-sm w-6 text-center tabular-nums text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center min-w-touch min-h-touch"
                    aria-label="Agregar uno más"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line total */}
                <div className="w-20 text-right shrink-0">
                  <PriceDisplay amount={item.price * item.quantity} size="sm" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Sticky footer */}
      {!isEmpty && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border px-4 py-4 z-30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total</span>
            <PriceDisplay amount={total} size="lg" className="font-bold text-foreground" />
          </div>
          <Button className="w-full h-12 rounded-button text-base font-bold" onClick={handleSend}>
            Enviar pedido al mesero
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
