/**
 * App – Root Component
 * 
 * Sets up providers (React Query, Tooltip, Toast) and defines
 * all application routes. The app is a single-flow guest experience
 * for restaurant table ordering.
 * 
 * Route structure:
 *   /                          → Redirects to onboarding
 *   /guest/onboarding          → Welcome slides
 *   /guest/menu                → Browse menu
 *   /guest/menu/:itemId        → Item detail
 *   /guest/cart                → Review cart / order tracking
 *   /guest/my-consumption      → Full bill overview
 *   /guest/split-tip           → Split bill & tip
 *   /guest/checkout/*          → Payment flows (card, terminal, cash, spei)
 *   /guest/payment-success     → Post-payment table status
 *   /guest/payment-failed      → Payment error
 *   /guest/quick-pay           → Adjustment payment
 *   /guest/quick-pay-success   → Adjustment confirmation
 *   /guest/farewell            → Loyalty summary & goodbye
 *   /guest/login               → Auth / sign-up
 *   /guest/post-registration   → Context-aware welcome screen
 *   /guest/profile             → User profile & loyalty
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ScrollToTop from './components/ScrollToTop';
import GuestLayout from './layouts/GuestLayout';
import NotFound from './pages/NotFound';

// Guest pages
import GuestOnboarding from './pages/guest/Onboarding';
import GuestMenu from './pages/guest/Menu';
import GuestCart from './pages/guest/Cart';
import GuestItemDetail from './pages/guest/ItemDetail';
import GuestOrderRejected from './pages/guest/OrderRejected';
import GuestOffline from './pages/guest/Offline';
import GuestMyConsumption from './pages/guest/MyConsumption';
import GuestTableStatus from './pages/guest/TableStatus';
import GuestSplitTip from './pages/guest/SplitTip';
import GuestCheckoutCard from './pages/guest/CheckoutCard';
import GuestCheckoutSpei from './pages/guest/CheckoutSpei';
import GuestCheckoutTerminal from './pages/guest/CheckoutTerminal';
import GuestCheckoutCash from './pages/guest/CheckoutCash';
import GuestPaymentFailed from './pages/guest/PaymentFailed';
import GuestPaymentSuccess from './pages/guest/PaymentSuccess';
import GuestEarlyExit from './pages/guest/EarlyExit';
import GuestOrderTracking from './pages/guest/OrderTracking';
import GuestQuickPay from './pages/guest/QuickPay';
import GuestQuickPaySuccess from './pages/guest/QuickPaySuccess';
import GuestLoyaltyFarewell from './pages/guest/LoyaltyFarewell';
import GuestLogin from './pages/guest/Login';
import GuestProfile from './pages/guest/Profile';
import GuestPostRegistration from './pages/guest/PostRegistration';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/guest/onboarding" replace />} />

          <Route path="/guest" element={<GuestLayout />}>
            {/* Core flow */}
            <Route path="onboarding" element={<GuestOnboarding />} />
            <Route path="menu" element={<GuestMenu />} />
            <Route path="menu/:itemId" element={<GuestItemDetail />} />
            <Route path="cart" element={<GuestCart />} />
            <Route path="order-tracking" element={<GuestOrderTracking />} />

            {/* Bill & payment */}
            <Route path="my-consumption" element={<GuestMyConsumption />} />
            <Route path="split-tip" element={<GuestSplitTip />} />
            <Route path="checkout/card" element={<GuestCheckoutCard />} />
            <Route path="checkout/spei" element={<GuestCheckoutSpei />} />
            <Route path="checkout/terminal" element={<GuestCheckoutTerminal />} />
            <Route path="checkout/cash" element={<GuestCheckoutCash />} />
            <Route path="payment-success" element={<GuestPaymentSuccess />} />
            <Route path="payment-failed" element={<GuestPaymentFailed />} />
            <Route path="quick-pay" element={<GuestQuickPay />} />
            <Route path="quick-pay-success" element={<GuestQuickPaySuccess />} />

            {/* Auth & profile */}
            <Route path="login" element={<GuestLogin />} />
            <Route path="post-registration" element={<GuestPostRegistration />} />
            <Route path="profile" element={<GuestProfile />} />
            <Route path="farewell" element={<GuestLoyaltyFarewell />} />

            {/* Edge cases */}
            <Route path="order-rejected" element={<GuestOrderRejected />} />
            <Route path="offline" element={<GuestOffline />} />
            <Route path="table-status" element={<GuestTableStatus />} />
            <Route path="early-exit" element={<GuestEarlyExit />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
