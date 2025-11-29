import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing-page';
import WalletCreation from './pages/walet-creation';
import Receive from './pages/receive';
import UserDashboard from './pages/user-dashboard';
import SendTransfer from './pages/send-transfer';
import Swap from './pages/swap';
import History from './pages/history';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/wallet-creation" element={<WalletCreation />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/send-transfer" element={<SendTransfer />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
