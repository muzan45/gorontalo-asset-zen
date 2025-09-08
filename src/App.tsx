import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/locations" element={<div className="p-8 text-center text-muted-foreground">Halaman Lokasi & Unit (Coming Soon)</div>} />
        <Route path="/scanner" element={<div className="p-8 text-center text-muted-foreground">Halaman QR Code Scanner (Coming Soon)</div>} />
        <Route path="/reports" element={<div className="p-8 text-center text-muted-foreground">Halaman Laporan (Coming Soon)</div>} />
        <Route path="/settings" element={<div className="p-8 text-center text-muted-foreground">Halaman Pengaturan (Coming Soon)</div>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
