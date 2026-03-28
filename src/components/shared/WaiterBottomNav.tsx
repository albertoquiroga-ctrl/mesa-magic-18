import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/waiter/dashboard', icon: '📋', label: 'Mesas' },
  { to: '/waiter/alerts', icon: '🔔', label: 'Alertas', badge: 3 },
  { to: '/waiter/tips', icon: '💰', label: 'Propinas' },
  { to: '/waiter/profile', icon: '👤', label: 'Perfil' },
];

export const WaiterBottomNav = () => {
  const { pathname } = useLocation();

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
              <span className="text-lg relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-[9px] font-bold font-mono rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </span>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="waiter-tab-indicator"
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
