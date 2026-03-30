import { Outlet, useLocation } from 'react-router-dom';
import { GuestBottomNav } from '@/components/shared/GuestBottomNav';
import { GuestFAB } from '@/components/shared/GuestFAB';

const hideNavRoutes = ['/guest/onboarding', '/guest/offline', '/guest/payment-success', '/guest/payment-failed', '/guest/early-exit', '/guest/login', '/guest/quick-pay-success', '/guest/farewell'];

const GuestLayout = () => {
  const { pathname } = useLocation();
  const showNav = !hideNavRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground max-w-[430px] mx-auto relative">
      <div className={showNav ? 'pb-20' : ''}>
        <Outlet />
      </div>
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
