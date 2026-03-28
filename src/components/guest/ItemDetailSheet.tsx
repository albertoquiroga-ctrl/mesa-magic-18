import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import type { MenuItem } from '@/data/mockData';

interface ItemDetailSheetProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

export const ItemDetailSheet = ({ item, open, onClose }: ItemDetailSheetProps) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Reset when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes('');
      setAdded(false);
    }
  }, [item?.id]);

  const handleAdd = () => {
    if (!item) return;
    for (let i = 0; i < quantity; i++) {
      addItem({ id: item.id, name: item.name, price: item.price, notes });
    }
    setAdded(true);
    setTimeout(() => {
      onClose();
      setAdded(false);
    }, 1200);
  };

  if (!item) return null;

  const total = item.price * quantity;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card z-50 overflow-hidden"
            style={{
              maxHeight: '75vh',
              borderTopLeftRadius: 'var(--radius-modal)',
              borderTopRightRadius: 'var(--radius-modal)',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(75vh - 100px)' }}>
              {/* Hero photo area */}
              <div className="w-full aspect-video bg-muted relative flex items-center justify-center">
                <span className="text-6xl">
                  {item.category === 'Bebidas' ? '🥤' : item.category === 'Entradas' ? '🥗' : '🍽️'}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
              </div>

              <div className="px-5 pb-4">
                {/* Name */}
                <h2 className="font-heading text-2xl font-semibold mt-2">{item.name}</h2>

                {/* Price */}
                <p className="font-mono text-xl text-primary mt-1 tabular-nums">
                  ${item.price} <span className="text-sm text-muted-foreground">MXN</span>
                </p>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-chip"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Special instructions */}
                <div className="mt-4">
                  <label className="text-sm font-medium mb-1.5 block">Instrucciones especiales</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="¿Sin sal? ¿Extra limón? Cuéntanos..."
                    className="w-full h-20 rounded-input bg-background border border-border px-3 py-2.5 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-center gap-6 mt-5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 rounded-full bg-muted flex items-center justify-center min-w-touch min-h-touch"
                    aria-label="Menos"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-mono text-xl w-8 text-center tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center min-w-touch min-h-touch"
                    aria-label="Más"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="px-5 pb-6 pt-3 border-t border-border bg-card">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                disabled={item.soldOut || added}
                className={`w-full h-[52px] rounded-button font-bold text-base transition-colors ${
                  added
                    ? 'bg-success text-primary-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {added ? (
                  '✓ Agregado'
                ) : (
                  <>
                    Agregar {quantity} — <span className="font-mono">${total} MXN</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
