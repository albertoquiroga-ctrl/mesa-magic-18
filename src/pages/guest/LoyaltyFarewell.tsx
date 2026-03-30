import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Gift, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { Button } from '@/components/ui/button';

const LoyaltyFarewell = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const rounds = useOrderStore((s) => s.rounds);

  const tableTotal = rounds.reduce(
    (sum, r) => sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  const pointsEarned = Math.round(tableTotal * 0.1);

  const levelColors: Record<string, string> = {
    Bronce: 'text-amber-700',
    Plata: 'text-slate-500',
    Oro: 'text-yellow-500',
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-6 py-12">
      {/* Animated star */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      >
        <Sparkles className="w-14 h-14 text-primary" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-[28px] font-semibold text-foreground mb-2 text-center"
      >
        ¡Gracias por tu visita!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-muted-foreground text-center mb-8 max-w-[300px]"
      >
        Esperamos verte pronto. Tu experiencia nos importa mucho.
      </motion.p>

      {isLoggedIn && user ? (
        <>
          {/* Points earned animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="bg-card border border-primary/20 rounded-card p-6 w-full max-w-[360px] mb-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-5 h-5 text-primary fill-primary" />
              <span className="text-sm font-medium text-muted-foreground">Puntos ganados hoy</span>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
              className="text-5xl font-bold text-primary block mb-1"
            >
              +{pointsEarned}
            </motion.span>
            <p className="text-xs text-muted-foreground">
              puntos añadidos a tu cuenta
            </p>
          </motion.div>

          {/* Loyalty progress */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-card border border-border rounded-card p-5 w-full max-w-[360px] mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className={`w-4 h-4 ${levelColors[user.loyalty.level] || 'text-primary'}`} />
                <span className="text-sm font-semibold text-foreground">Nivel {user.loyalty.level}</span>
              </div>
              <span className="text-xs text-muted-foreground">{user.name}</span>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>{user.loyalty.points + pointsEarned} pts</span>
                <span>{user.loyalty.nextRewardAt} pts</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: `${(user.loyalty.points / user.loyalty.nextRewardAt) * 100}%` }}
                  animate={{ width: `${Math.min(((user.loyalty.points + pointsEarned) / user.loyalty.nextRewardAt) * 100, 100)}%` }}
                  transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            {user.loyalty.points + pointsEarned >= user.loyalty.nextRewardAt ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/10 mt-3"
              >
                <Gift className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  🎉 ¡Desbloqueaste una recompensa!
                </span>
              </motion.div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                Te faltan <strong className="text-foreground">
                  {user.loyalty.nextRewardAt - user.loyalty.points - pointsEarned}
                </strong> puntos para tu siguiente recompensa.
              </p>
            )}
          </motion.div>

          {/* Savings reminder */}
          {user.loyalty.savingsAvailable > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-primary/5 border border-primary/20 rounded-card p-4 w-full max-w-[360px] mb-6"
            >
              <p className="text-xs text-center text-muted-foreground">
                Recuerda que tienes <strong className="text-primary">${user.loyalty.savingsAvailable} de descuento</strong> disponible para tu próxima visita 🎁
              </p>
            </motion.div>
          )}
        </>
      ) : (
        /* Not logged in — last chance nudge */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-[360px] mb-6"
        >
          <div className="bg-card border border-primary/20 rounded-card p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Pudiste ganar {pointsEarned} puntos hoy
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Únete al programa de lealtad y acumula puntos en cada visita. 
              Además, <strong className="text-primary">ahorra $50</strong> al registrarte.
            </p>
            <Button
              className="w-full h-11 rounded-button text-sm font-semibold"
              onClick={() => navigate('/guest/login', { state: { returnTo: '/guest/farewell', nudgeOrigin: 'farewell' } })}
            >
              Crear cuenta gratis
            </Button>
          </div>
        </motion.div>
      )}

      {/* Profile link for logged in users */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="w-full max-w-[360px]"
      >
        {isLoggedIn ? (
          <Button
            variant="outline"
            className="w-full h-12 rounded-button text-sm"
            onClick={() => navigate('/guest/profile')}
          >
            Ver mi perfil <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full h-12 rounded-button text-sm text-muted-foreground"
            onClick={() => navigate('/guest/menu')}
          >
            Continuar sin cuenta
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default LoyaltyFarewell;
