import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import type { MenuItem } from '@/data/mockData';

interface MenuItemCardProps {
  item: MenuItem;
  onTap: () => void;
}

export const MenuItemCard = ({ item, onTap }: MenuItemCardProps) => {
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === item.id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.soldOut) return;
    addItem({ id: item.id, name: item.name, price: item.price });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) updateQuantity(item.id, cartItem.quantity - 1);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      className={`rounded-card bg-card border border-border overflow-hidden cursor-pointer ${
        item.soldOut ? 'opacity-50' : ''
      }`}
    >
      {/* Photo placeholder */}
      <div className="aspect-square bg-muted relative flex items-center justify-center">
        <span className="text-3xl">
          {item.category === 'Bebidas' ? '🥤' : item.category === 'Entradas' ? '🥗' : '🍽️'}
        </span>
        {item.soldOut && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-chip">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium leading-tight line-clamp-2 mb-1.5">
          {item.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-primary tabular-nums">
            ${item.price}
          </span>

          {/* Add / quantity selector */}
          {!item.soldOut && (
            <>
              {cartItem ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={handleDecrement}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center min-w-touch min-h-touch"
                    aria-label="Quitar uno"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-sm w-5 text-center tabular-nums">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={handleAdd}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center min-w-touch min-h-touch"
                    aria-label="Agregar uno"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleAdd}
                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center min-w-touch min-h-touch"
                  aria-label="Agregar al carrito"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
