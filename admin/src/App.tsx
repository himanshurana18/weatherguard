// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'react-hot-toast';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Login } from './pages/Login';
// import { Layout } from './components/Layout';
// import { Dashboard } from './pages/Dashboard';
// import { Users } from './pages/Users';
// import { Alerts } from './pages/Alerts';
// import { Audit } from './pages/Audit';
// import { useAuth } from './hooks/useAuth';

// const queryClient = new QueryClient();

// export function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route element={<ProtectedLayout />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/dashboard/users" element={<Users />} />
//             <Route path="/dashboard/alerts" element={<Alerts />} />
//             <Route path="/dashboard/audit" element={<Audit />} />
//           </Route>
//           <Route path="/" element={<Navigate to="/dashboard" />} />
//         </Routes>
//       </BrowserRouter>
//       <Toaster />
//     </QueryClientProvider>
//   );
// }

// function ProtectedLayout() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-2xl text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     window.location.href = '/login';
//     return null;
//   }

//   if (user.status !== 'approved') {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-100">
//         <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
//           <p className="text-gray-600 mb-4">Your account is currently {user.status}.</p>
//           <p className="text-sm text-gray-500">Please wait for admin approval to access the dashboard.</p>
//         </div>
//       </div>
//     );
//   }

//   return <Layout />;
// }

// function Navigate({ to }: { to: string }) {
//   window.location.href = to;
//   return null;
// }
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Alerts } from "./pages/Alerts";
import { Audit } from "./pages/Audit";
import { Settings } from "./pages/Setting";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/alerts" element={<Alerts />} />
            <Route path="/dashboard/audit" element={<Audit />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (user.status !== "approved") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Your account is currently {user.status}.
          </p>
          <p className="text-sm text-gray-500">
            Please wait for admin approval to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return <Layout />;
}

function Navigate({ to }: { to: string }) {
  window.location.href = to;
  return null;
}
