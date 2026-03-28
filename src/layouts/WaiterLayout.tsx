import { Outlet } from 'react-router-dom';
import { WaiterBottomNav } from '@/components/shared/WaiterBottomNav';

const WaiterLayout = () => {
  return (
    <div className="min-h-screen max-w-[430px] mx-auto relative waiter-theme bg-background text-foreground">
      <div className="pb-20">
        <Outlet />
      </div>
      <WaiterBottomNav />
    </div>
  );
};

export default WaiterLayout;
