import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore } from '@/stores/sessionStore';

const slides = [
  {
    icon: '🍴',
    title: 'Ordena desde tu cel',
    subtitle: 'Sin filas. Sin esperas.',
  },
  {
    icon: '👋',
    title: 'Tu mesero siempre cerca',
    subtitle: 'Un toque y viene.',
  },
  {
    icon: '💳',
    title: 'Paga cuando quieras',
    subtitle: 'Sin drama. Sin esperas.',
  },
];

const Onboarding = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const tableNumber = useSessionStore((s) => s.tableNumber);

  const goNext = () => {
    if (current === 2) {
      navigate('/guest/menu');
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const skip = () => navigate('/guest/menu');

  return (
    <div
      className="h-[100dvh] bg-background flex flex-col relative select-none overflow-hidden"
      onClick={goNext}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 relative z-10">
        <span className="font-mono text-xs bg-card border border-border rounded-chip px-3 py-1.5">
          Mesa {tableNumber}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
          className="text-muted-foreground text-[13px] min-h-touch min-w-touch flex items-center justify-end"
        >
          Saltar →
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Illustration circle */}
            <div className="w-[120px] h-[120px] rounded-full bg-accent flex items-center justify-center mb-8">
              <span className="text-5xl">{slides[current].icon}</span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-[28px] leading-tight font-semibold text-foreground mb-3">
              {slides[current].title}
            </h1>

            {/* Subtitle */}
            <p className="text-base text-muted-foreground">
              {slides[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="px-5 pb-8 relative z-10 space-y-5">
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor:
                  i === current
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--muted-foreground) / 0.3)',
              }}
              className="h-2 rounded-full"
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="w-full h-[52px] rounded-button bg-primary text-primary-foreground font-bold text-base"
        >
          {current === 2 ? 'Entrar al menú →' : 'Siguiente →'}
        </button>
        {current === 2 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/guest/login');
            }}
            className="w-full text-center text-sm text-muted-foreground py-2"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
