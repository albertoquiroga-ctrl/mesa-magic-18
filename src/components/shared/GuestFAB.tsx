import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const options = [
  { icon: '📋', label: 'Pedir la cuenta', message: 'Se ha solicitado la cuenta' },
  { icon: '💧', label: 'Más agua', message: 'Se ha pedido más agua' },
  { icon: '🍽️', label: 'Cubiertos / servilletas', message: 'Se han solicitado cubiertos y servilletas' },
  { icon: '❓', label: 'Otra cosa', message: 'Un mesero vendrá en un momento' },
];

export const GuestFAB = () => {
  const [open, setOpen] = useState(false);

  const handleOption = (option: typeof options[0]) => {
    setOpen(false);
    toast.success(option.message, { description: 'Tu mesero fue notificado' });
  };

  return (
    <>
      {/* Overlay */}
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

      {/* Options panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-40 right-4 z-50 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">¿En qué te ayudamos?</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              {options.map((opt) => (
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
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center text-xl"
        aria-label="Llamar mesero"
      >
        {open ? <X size={24} /> : '🙋'}
      </motion.button>
    </>
  );
};
