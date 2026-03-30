import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import GuestLayout from "./layouts/GuestLayout";
import NotFound from "./pages/NotFound";

// Guest pages
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
import GuestOrderTracking from "./pages/guest/OrderTracking";
import GuestQuickPay from "./pages/guest/QuickPay";
import GuestQuickPaySuccess from "./pages/guest/QuickPaySuccess";
import GuestLoyaltyFarewell from "./pages/guest/LoyaltyFarewell";
import GuestLogin from "./pages/guest/Login";
import GuestProfile from "./pages/guest/Profile";

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
            <Route path="menu/:itemId" element={<GuestItemDetail />} />
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
            <Route path="order-tracking" element={<GuestOrderTracking />} />
            <Route path="quick-pay" element={<GuestQuickPay />} />
            <Route path="quick-pay-success" element={<GuestQuickPaySuccess />} />
            <Route path="farewell" element={<GuestLoyaltyFarewell />} />
            <Route path="login" element={<GuestLogin />} />
            <Route path="profile" element={<GuestProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
