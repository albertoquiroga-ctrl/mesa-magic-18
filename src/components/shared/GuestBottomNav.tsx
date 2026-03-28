import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';

const tabs = [
  { to: '/guest/menu', icon: '🍽️', label: 'Menú' },
  { to: '/guest/cart', icon: '📋', label: 'Mi orden' },
  { to: '/guest/my-consumption', icon: '💳', label: 'Pagar' },
];

export const GuestBottomNav = () => {
  const { pathname } = useLocation();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.to);
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="flex flex-col items-center justify-center min-w-touch min-h-touch gap-0.5 relative"
            >
              <span className="text-lg">{tab.icon}</span>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </span>
              {tab.to === '/guest/cart' && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 right-1 bg-primary text-primary-foreground text-[9px] font-bold font-mono rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="guest-tab-indicator"
                  className="absolute -bottom-0 h-0.5 w-8 bg-primary rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
