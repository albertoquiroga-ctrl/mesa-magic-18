/**
 * CartBar
 * 
 * Sticky bottom bar shown on the Menu page.
 * When empty, shows an inviting placeholder.
 * When items are added, shows count + total and links to the Cart page.
 */
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';

export const CartBar = () => {
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.getItemCount());
  const total = useCartStore((s) => s.getTotal());
  const hasItems = itemCount > 0;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-2 z-30">
      <motion.button
        onClick={() => hasItems && navigate('/guest/cart')}
        layout
        className={`w-full h-[52px] rounded-button flex items-center justify-center text-sm font-bold transition-colors ${
          hasItems
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground border border-border'
        }`}
      >
        <AnimatePresence mode="wait">
          {hasItems ? (
            <motion.span
              key="filled"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <span>{itemCount} producto{itemCount > 1 ? 's' : ''}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">${total} MXN</span>
              <span>·</span>
              <span>Ver carrito →</span>
            </motion.span>
          ) : (
            <motion.span
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              Agrega algo para empezar 🍴
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
