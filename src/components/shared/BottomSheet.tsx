import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  snapHeight?: string; // e.g. '60vh'
}

export const BottomSheet = ({ open, onClose, children, snapHeight = '70vh' }: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-50"
            onClick={onClose}
          />
          <motion.div
            ref={sheetRef}
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
              maxHeight: snapHeight,
              borderTopLeftRadius: 'var(--radius-modal)',
              borderTopRightRadius: 'var(--radius-modal)',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: `calc(${snapHeight} - 28px)` }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
