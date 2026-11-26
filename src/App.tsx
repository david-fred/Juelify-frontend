import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { Skeleton } from '@/components/ui/Skeleton';
import { ToastViewport } from '@/components/ui/Toast';
import { ComingSoonPage } from '@/pages/ComingSoonPage';

// Route pages are lazy-loaded to keep the initial bundle small.
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const VerifyEmailPage = lazy(() =>
  import('@/pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);
const CommunitySelectPage = lazy(() =>
  import('@/pages/auth/CommunitySelectPage').then((m) => ({ default: m.CommunitySelectPage })),
);

function RouteFallback() {
  return (
    <div className="min-h-screen bg-surface-base p-6 space-y-4">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Signed in */}
          <Route element={<RequireAuth />}>
            <Route path="/select-community" element={<CommunitySelectPage />} />

            <Route element={<AppShell />}>
              <Route
                path="/feed"
                element={<ComingSoonPage title="Feed & Announcements" milestone="Milestone 2" />}
              />
              <Route
                path="/materials"
                element={<ComingSoonPage title="Material Vault" milestone="Milestone 3" />}
              />
              <Route
                path="/contributions"
                element={<ComingSoonPage title="Contributions & Wallet" milestone="Milestone 4" />}
              />
              <Route
                path="/calendar"
                element={<ComingSoonPage title="Calendar & Events" milestone="Milestone 5" />}
              />
              <Route
                path="/polls"
                element={<ComingSoonPage title="Polls & Voting" milestone="Milestone 5" />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </Suspense>
      <ToastViewport />
    </BrowserRouter>
  );
}
