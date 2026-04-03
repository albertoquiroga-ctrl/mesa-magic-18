import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import { mockMenuItems } from '@/data/mockData';
import { useAuthStore } from '@/stores/authStore';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Gift } from 'lucide-react';
import OrderTracking from './OrderTracking';
import { useTranslation } from '@/i18n/useTranslation';

const Cart = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    
    // If first round, simulate other guests' prior orders
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

    addRound({
      id: crypto.randomUUID(),
      round: currentRound,
      items: items.map((i) => {
        const menuItem = mockMenuItems.find((m) => m.id === i.id);
        return { name: i.name, quantity: i.quantity, price: i.price, category: menuItem?.category, orderedByDevice: true };
      }),
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
          {t('cart.sent')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground text-center"
        >
          {t('cart.sentSub')}
        </motion.p>
      </div>
    );
  }

  // If cart is empty and there's an active order, show tracking
  if (isEmpty && hasActiveOrder && !sent) {
    return <OrderTracking embedded />;
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
          <h1 className="text-base font-semibold text-foreground">{t('cart.title')}</h1>
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
            <p className="text-sm text-muted-foreground">{t('cart.empty')}</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/guest/menu')}>
              {t('cart.explore')}
            </Button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.cartKey}
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
                  {item.modifiers && item.modifiers.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.modifiers.map((m) => m.optionLabel).join(', ')}
                    </p>
                  )}
                  <PriceDisplay amount={item.price + (item.modifiers ?? []).reduce((s, m) => s + m.extraPrice, 0)} size="sm" className="text-muted-foreground" />
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">📝 {item.notes}</p>
                  )}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() =>
                      item.quantity === 1 ? removeItem(item.cartKey) : updateQuantity(item.cartKey, item.quantity - 1)
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
                    onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
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
          {!useAuthStore.getState().isLoggedIn ? (
            <button
              onClick={() => navigate('/guest/login', { state: { returnTo: '/guest/cart', nudgeOrigin: 'cart' } })}
              className="flex items-center gap-2 w-full p-2.5 mb-3 rounded-lg bg-primary/5 border border-primary/20 text-left"
            >
              <Gift className="w-4 h-4 text-primary shrink-0" />
              <span className="text-[11px] text-muted-foreground">
                <strong className="text-foreground">Ahorra $50</strong> — únete al programa de lealtad
              </span>
            </button>
          ) : useAuthStore.getState().user?.loyalty.savingsAvailable ? (
            <div className="flex items-center gap-2 w-full p-2.5 mb-3 rounded-lg bg-green-50 border border-green-200 text-left">
              <Gift className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-[11px] text-muted-foreground">
                Tienes <strong className="text-green-700">${useAuthStore.getState().user?.loyalty.savingsAvailable} de descuento</strong> disponible 🎉
              </span>
            </div>
          ) : null}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{t('common.total')}</span>
            <PriceDisplay amount={total} size="lg" className="font-bold text-foreground" />
          </div>
          <Button className="w-full h-12 rounded-button text-base font-bold" onClick={handleSend}>
            {t('cart.send')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
