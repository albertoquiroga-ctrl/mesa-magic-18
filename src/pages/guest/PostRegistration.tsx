import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Star, TrendingUp, ChefHat, PartyPopper } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { Button } from '@/components/ui/button';

export type NudgeOrigin = 'menu' | 'cart' | 'split-tip' | 'farewell' | 'onboarding' | 'profile' | 'general';

const originConfig: Record<NudgeOrigin, {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  highlight: string;
  highlightSub: string;
  cta: string;
  returnTo: string;
}> = {
  menu: {
    icon: <ChefHat className="w-10 h-10 text-primary" />,
    title: '¡Bienvenida al club!',
    subtitle: 'Tu cuenta está lista. Mira lo que desbloqueaste:',
    highlight: 'Recomendaciones personalizadas',
    highlightSub: 'Ahora verás platillos sugeridos según tus gustos',
    cta: 'Ver recomendaciones →',
    returnTo: '/guest/menu',
  },
  cart: {
    icon: <Gift className="w-10 h-10 text-primary" />,
    title: '¡Descuento desbloqueado!',
    subtitle: 'Tu cuenta está lista y ya tienes un regalo:',
    highlight: '$50 de descuento disponible',
    highlightSub: 'Se aplicará en tu próxima visita automáticamente',
    cta: 'Volver al carrito →',
    returnTo: '/guest/cart',
  },
  'split-tip': {
    icon: <TrendingUp className="w-10 h-10 text-primary" />,
    title: '¡Ya acumulas puntos!',
    subtitle: 'A partir de ahora cada peso cuenta:',
    highlight: 'Puntos por esta compra',
    highlightSub: 'Ganarás puntos por el pago que estás a punto de hacer',
    cta: 'Continuar con el pago →',
    returnTo: '/guest/split-tip',
  },
  farewell: {
    icon: <Star className="w-10 h-10 text-primary fill-primary" />,
    title: '¡Tus puntos ya cuentan!',
    subtitle: 'Todo lo que consumiste hoy ya suma:',
    highlight: 'Puntos registrados',
    highlightSub: 'Tus puntos se acumularon retroactivamente',
    cta: 'Ver mis puntos →',
    returnTo: '/guest/farewell',
  },
  onboarding: {
    icon: <PartyPopper className="w-10 h-10 text-primary" />,
    title: '¡Bienvenida!',
    subtitle: 'Tu cuenta está lista. Esto es lo que obtuviste:',
    highlight: '$50 de descuento + puntos',
    highlightSub: 'Acumula puntos en cada visita y desbloquea recompensas',
    cta: 'Explorar el menú →',
    returnTo: '/guest/menu',
  },
  profile: {
    icon: <PartyPopper className="w-10 h-10 text-primary" />,
    title: '¡Cuenta creada!',
    subtitle: 'Ya eres parte del programa de lealtad:',
    highlight: '$50 de descuento de bienvenida',
    highlightSub: 'Disponible para tu próxima visita',
    cta: 'Ver mi perfil →',
    returnTo: '/guest/profile',
  },
  general: {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    title: '¡Listo!',
    subtitle: 'Tu cuenta está activa:',
    highlight: 'Programa de lealtad activado',
    highlightSub: 'Acumula puntos y desbloquea recompensas',
    cta: 'Continuar →',
    returnTo: '/guest/menu',
  },
};

const PostRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const rounds = useOrderStore((s) => s.rounds);

  const state = location.state as { nudgeOrigin?: NudgeOrigin; returnTo?: string } | null;
  const origin: NudgeOrigin = state?.nudgeOrigin || 'general';
  const config = originConfig[origin];
  const overrideReturn = state?.returnTo;

  const tableTotal = rounds.reduce(
    (sum, r) => sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );
  const pointsEarned = Math.round(tableTotal * 0.1);

  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHighlight(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-6 py-12">
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      >
        {config.icon}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-[28px] font-semibold text-foreground mb-2 text-center"
      >
        {config.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-muted-foreground text-center mb-8 max-w-[300px]"
      >
        {config.subtitle}
      </motion.p>

      {/* Highlight card with animation */}
      <AnimatePresence>
        {showHighlight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-card border border-primary/20 rounded-card p-6 w-full max-w-[360px] mb-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
            >
              {origin === 'cart' || origin === 'profile' || origin === 'onboarding' ? (
                <Gift className="w-8 h-8 text-primary" />
              ) : origin === 'split-tip' || origin === 'farewell' ? (
                <Star className="w-8 h-8 text-primary fill-primary" />
              ) : (
                <Sparkles className="w-8 h-8 text-primary" />
              )}
            </motion.div>

            <h3 className="text-lg font-bold text-foreground mb-1">
              {config.highlight}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {config.highlightSub}
            </p>

            {/* Context-specific content */}
            {(origin === 'split-tip' || origin === 'farewell') && pointsEarned > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="mt-3 p-3 rounded-lg bg-primary/5"
              >
                <span className="text-3xl font-bold text-primary">+{pointsEarned}</span>
                <p className="text-xs text-muted-foreground mt-1">puntos por esta visita</p>
              </motion.div>
            )}

            {(origin === 'cart' || origin === 'profile' || origin === 'onboarding') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 p-3 rounded-lg bg-primary/5"
              >
                <span className="text-2xl font-bold text-primary">$50</span>
                <p className="text-xs text-muted-foreground mt-1">descuento de bienvenida</p>
              </motion.div>
            )}

            {origin === 'menu' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-primary/5 justify-center"
              >
                <ChefHat className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">IA personalizada activa</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome savings reminder */}
      {user && user.loyalty.savingsAvailable > 0 && origin !== 'cart' && origin !== 'profile' && origin !== 'onboarding' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-primary/5 border border-primary/20 rounded-card p-4 w-full max-w-[360px] mb-4"
        >
          <p className="text-xs text-center text-muted-foreground">
            También tienes <strong className="text-primary">${user.loyalty.savingsAvailable} de descuento</strong> de bienvenida 🎁
          </p>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="w-full max-w-[360px] mt-4"
      >
        <Button
          className="w-full h-12 rounded-button text-sm font-semibold"
          onClick={() => navigate(overrideReturn || config.returnTo, { replace: true })}
        >
          {config.cta}
        </Button>
      </motion.div>
    </div>
  );
};

export default PostRegistration;
