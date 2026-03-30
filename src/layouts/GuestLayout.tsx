/**
 * GuestLayout
 * 
 * Root layout for the guest experience. Wraps all /guest/* routes.
 * Conditionally shows the bottom navigation bar and the FAB (call waiter)
 * on pages that need them, hiding them on full-screen flows like
 * onboarding, payment success, login, etc.
 */
import { Outlet, useLocation } from 'react-router-dom';
import { GuestBottomNav } from '@/components/shared/GuestBottomNav';
import { GuestFAB } from '@/components/shared/GuestFAB';

// Routes where the bottom nav and FAB should be hidden
const HIDE_NAV_ROUTES = [
  '/guest/onboarding',
  '/guest/offline',
  '/guest/payment-success',
  '/guest/payment-failed',
  '/guest/early-exit',
  '/guest/login',
  '/guest/quick-pay-success',
  '/guest/farewell',
  '/guest/post-registration',
];

const GuestLayout = () => {
  const { pathname } = useLocation();
  const showNav = !HIDE_NAV_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground max-w-[430px] mx-auto relative">
      {/* Page content — extra bottom padding when nav is visible */}
      <div className={showNav ? 'pb-20' : ''}>
        <Outlet />
      </div>

      {/* Persistent UI elements */}
      {showNav && (
        <>
          <GuestFAB />
          <GuestBottomNav />
        </>
      )}
    </div>
  );
};

export default GuestLayout;
