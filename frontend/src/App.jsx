import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Core — never lazy (instant first render)
import Landing   from './components/Landing';
import Login     from './pages/Login';
import Signup    from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Lazy — loaded on demand
const AdoptionDiscover   = lazy(() => import('./pages/adoption/AdoptionDiscover'));
const AdoptionDetails    = lazy(() => import('./pages/adoption/AdoptionDetails'));
const SponsorshipPage    = lazy(() => import('./pages/sponsorship/SponsorshipPage'));
const OrphanagesPage     = lazy(() => import('./pages/OrphanagesPage'));
const AboutPage          = lazy(() => import('./pages/AboutPage'));
const AdminDashboard     = lazy(() => import('./pages/AdminDashboard'));
const ChildcareDashboard = lazy(() => import('./pages/admin/ChildcareDashboard'));
const OrphanageRegister  = lazy(() => import('./pages/orphanage/OrphanageRegister'));

const PrivacyPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage   = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.TermsPage })));
const CookiePage  = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.CookiePage })));

const ChatbotWidget = lazy(() =>
  import('./components/ChatbotWidget').catch(() => ({ default: () => null }))
);

function PageSpinner() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F0F6FF' }}>
      <div style={{ width:44, height:44, border:'3px solid #BDE8F5', borderTopColor:'#0F2854', borderRadius:'50%', animation:'lbspin .7s linear infinite' }}/>
      <style>{`@keyframes lbspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace/>;
  return children;
}


function AdminRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated)                      return <Navigate to="/login" replace/>;
  if (!roles.includes(user?.userType))       return <Navigate to="/dashboard" replace/>;
  return children;
}


function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isGuest, user } = useAuth();

  if (isGuest) return children;  // guests can always access /login and /signup

  if (isAuthenticated) {
    const dest = {
      admin:              '/admin/dashboard',
      super_admin:        '/admin/dashboard',
      childcare_services: '/childcare/dashboard',
    }[user?.userType] || '/dashboard';
    return <Navigate to={dest} replace/>;
  }

  return children;
}

function AppRoutes() {
  return (
    <>
      <Suspense fallback={<PageSpinner/>}>
        <Routes>

          {/* ── Always public ── */}
          <Route path="/"           element={<Landing/>}/>
          <Route path="/about"      element={<AboutPage/>}/>
          <Route path="/orphanages" element={<OrphanagesPage/>}/>
          <Route path="/privacy"    element={<PrivacyPage/>}/>
          <Route path="/terms"      element={<TermsPage/>}/>
          <Route path="/cookies"    element={<CookiePage/>}/>

          {/* SponsorshipPage handles guest access internally */}
          <Route path="/sponsorship" element={<SponsorshipPage/>}/>

          {/* Auth — guests allowed through */}
          <Route path="/login"  element={<PublicOnlyRoute><Login/></PublicOnlyRoute>}/>
          <Route path="/signup" element={<PublicOnlyRoute><Signup/></PublicOnlyRoute>}/>

          {/* User dashboard — any authenticated user */}
          <Route path="/dashboard"
            element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>

          {/* Adoption — no role restriction here, RoleGuard inside page handles it */}
          <Route path="/adoption/discover"
            element={<ProtectedRoute><AdoptionDiscover/></ProtectedRoute>}/>
          <Route path="/adoption/details/:applicationId"
            element={<ProtectedRoute><AdoptionDetails/></ProtectedRoute>}/>

          {/* Orphanage registration */}
          <Route path="/orphanage/register"
            element={<ProtectedRoute><OrphanageRegister/></ProtectedRoute>}/>

          {/* Admin — super_admin AND admin */}
          <Route path="/admin/dashboard"
            element={
              <AdminRoute roles={['admin', 'super_admin']}>
                <AdminDashboard/>
              </AdminRoute>
            }/>

          {/* Childcare Services */}
          <Route path="/childcare/dashboard"
            element={
              <AdminRoute roles={['childcare_services']}>
                <ChildcareDashboard/>
              </AdminRoute>
            }/>

          <Route path="*" element={<Navigate to="/" replace/>}/>

        </Routes>
      </Suspense>

      <Suspense fallback={null}><ChatbotWidget/></Suspense>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </Router>
  );
}
