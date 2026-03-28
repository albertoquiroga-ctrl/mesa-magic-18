import { motion } from 'framer-motion';

export const GuestFAB = () => {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center text-xl"
      aria-label="Llamar mesero"
    >
      🙋
    </motion.button>
  );
};
