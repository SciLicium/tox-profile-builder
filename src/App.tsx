
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Use the re-exported AuthProvider
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/auth/UpdatePasswordPage";
import VerificationPage from "./pages/auth/VerificationPage";

// User pages
import ProfilePage from "./pages/profile/ProfilePage";

// Admin pages
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import SubstancesManagementPage from "./pages/admin/SubstancesManagementPage";
import EditSubstancePage from "./pages/admin/EditSubstancePage";
import SubstanceSectionsPage from "./pages/admin/SubstanceSectionsPage";
import ViewSubstancePage from "./pages/admin/ViewSubstancePage";
import ToxSectionsPage from "./pages/admin/ToxSectionsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
            <Route path="/auth/verification" element={<VerificationPage />} />
            
            {/* User Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={<UsersManagementPage />} />
            <Route path="/admin/substances" element={<SubstancesManagementPage />} />
            <Route path="/admin/substances/edit/:id" element={<EditSubstancePage />} />
            <Route path="/admin/substances/sections/:id" element={<SubstanceSectionsPage />} />
            <Route path="/admin/substances/view/:id" element={<ViewSubstancePage />} />
            <Route path="/admin/substances/toxsections/:id" element={<ToxSectionsPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
