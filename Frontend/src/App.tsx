import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Centers from "./pages/Centers";
import Pickup from "./pages/Pickup";
import Guide from "./pages/Guide";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllSchedules from "./pages/AllSchedules";
import Business from "./pages/Business";
import Ads from "./pages/Ads";
import ManageUsers from "./pages/ManageUsers";
import OverallManagement from "./pages/OverallManagement";
import TestRole from "./pages/TestRole";
import DebugAuth from "./pages/DebugAuth";
import { Navigate, useLocation } from "react-router-dom";
import { setupTokenExpirationCheck } from "./lib/tokenUtils";

const queryClient = new QueryClient();

// Component to handle token expiration checking
function TokenExpirationChecker() {
  useEffect(() => {
    // Set up token expiration checking
    const cleanup = setupTokenExpirationCheck();
    
    // Cleanup on unmount
    return cleanup;
  }, []);
  
  return null; // This component doesn't render anything
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TokenExpirationChecker />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }>
            <Route index element={<Dashboard />} />
            <Route path="centers" element={<Centers />} />
            <Route path="pickup" element={<Pickup />} />
            <Route path="guide" element={<Guide />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="profile" element={<Profile />} />
            <Route path="all-schedules" element={<AllSchedules />} />
            <Route path="business" element={<Business />} />
            <Route path="ads" element={<Ads />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="overall-management" element={<OverallManagement />} />
            <Route path="test-role" element={<TestRole />} />
            <Route path="debug-auth" element={<DebugAuth />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
