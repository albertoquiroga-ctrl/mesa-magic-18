import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GuestLayout from "./layouts/GuestLayout";
import WaiterLayout from "./layouts/WaiterLayout";
import NotFound from "./pages/NotFound";

// Guest pages (placeholders)
import GuestOnboarding from "./pages/guest/Onboarding";
import GuestMenu from "./pages/guest/Menu";
import GuestCart from "./pages/guest/Cart";
import GuestItemDetail from "./pages/guest/ItemDetail";

import GuestOrderRejected from "./pages/guest/OrderRejected";
import GuestOffline from "./pages/guest/Offline";
import GuestMyConsumption from "./pages/guest/MyConsumption";
import GuestTableStatus from "./pages/guest/TableStatus";
import GuestSplitTip from "./pages/guest/SplitTip";
import GuestCheckoutCard from "./pages/guest/CheckoutCard";
import GuestCheckoutSpei from "./pages/guest/CheckoutSpei";
import GuestPaymentFailed from "./pages/guest/PaymentFailed";
import GuestPaymentSuccess from "./pages/guest/PaymentSuccess";
import GuestEarlyExit from "./pages/guest/EarlyExit";

// Waiter pages (placeholders)
import WaiterDashboard from "./pages/waiter/Dashboard";
import WaiterTable from "./pages/waiter/Table";
import WaiterTips from "./pages/waiter/Tips";
import WaiterAlerts from "./pages/waiter/Alerts";
import WaiterProfile from "./pages/waiter/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/guest/onboarding" replace />} />

          {/* Guest routes */}
          <Route path="/guest" element={<GuestLayout />}>
            <Route path="onboarding" element={<GuestOnboarding />} />
            <Route path="menu" element={<GuestMenu />} />
            <Route path="menu/:itemId" element={<GuestMenu />} />
            <Route path="cart" element={<GuestCart />} />
            
            <Route path="order-rejected" element={<GuestOrderRejected />} />
            <Route path="offline" element={<GuestOffline />} />
            <Route path="my-consumption" element={<GuestMyConsumption />} />
            <Route path="table-status" element={<GuestTableStatus />} />
            <Route path="split-tip" element={<GuestSplitTip />} />
            <Route path="checkout/card" element={<GuestCheckoutCard />} />
            <Route path="checkout/spei" element={<GuestCheckoutSpei />} />
            <Route path="payment-failed" element={<GuestPaymentFailed />} />
            <Route path="payment-success" element={<GuestPaymentSuccess />} />
            <Route path="early-exit" element={<GuestEarlyExit />} />
          </Route>

          {/* Waiter routes */}
          <Route path="/waiter" element={<WaiterLayout />}>
            <Route path="dashboard" element={<WaiterDashboard />} />
            <Route path="table/:id" element={<WaiterTable />} />
            <Route path="tips" element={<WaiterTips />} />
            <Route path="alerts" element={<WaiterAlerts />} />
            <Route path="profile" element={<WaiterProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
