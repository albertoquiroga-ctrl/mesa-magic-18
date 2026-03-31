/**
 * GuestFAB (Floating Action Button)
 * 
 * A persistent "call waiter" button that floats above the bottom nav.
 * Opens a popover with quick-request options (bill, water, cutlery, other).
 * 
 * Visibility rules:
 * - Hidden on checkout/payment flows (those have their own CTAs)
 * - Positioned higher on pages that have a pinned CTA bar above the nav
 */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Waiter request options
// ---------------------------------------------------------------------------

const WAITER_OPTIONS = [
  { icon: '📋', label: 'Pedir la cuenta', message: 'Se ha solicitado la cuenta' },
  { icon: '💧', label: 'Más agua', message: 'Se ha pedido más agua' },
  { icon: '🍽️', label: 'Cubiertos / servilletas', message: 'Se han solicitado cubiertos y servilletas' },
  { icon: '❓', label: 'Otra cosa', message: 'Un mesero vendrá en un momento' },
] as const;

// Routes where the FAB is completely hidden (they have their own CTAs)
const HIDDEN_ROUTES = ['/guest/split-tip', '/guest/checkout', '/guest/quick-pay'];

// Routes with a fixed CTA bar above the bottom nav (FAB needs extra lift)
const PINNED_CTA_ROUTES = ['/guest/menu', '/guest/cart', '/guest/my-consumption'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const GuestFAB = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const hideFAB = HIDDEN_ROUTES.some((route) => pathname.startsWith(route));
  const hasPinnedCTA = PINNED_CTA_ROUTES.some((route) => pathname.startsWith(route));

  if (hideFAB) return null;

  const handleOption = (option: (typeof WAITER_OPTIONS)[number]) => {
    setOpen(false);
    toast.success(option.message, { description: 'Tu mesero fue notificado' });
  };

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Options popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-4 z-50 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
            style={{ bottom: hasPinnedCTA ? '15rem' : '10rem' }}
          >
            {/* Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">¿En qué te ayudamos?</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground">
                <X size={16} />
              </button>
            </div>

            {/* Option buttons */}
            <div className="p-1.5 flex flex-col gap-0.5">
              {WAITER_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleOption(opt)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-accent transition-colors text-left w-full"
                >
                  <span className="text-lg">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className={`fixed right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center text-xl ${
          hasPinnedCTA ? 'bottom-44' : 'bottom-24'
        }`}
        aria-label="Llamar mesero"
      >
        {open ? <X size={24} /> : '🙋'}
      </motion.button>
    </>
  );
};
