// import { ReactNode } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { Outlet, useNavigate } from 'react-router-dom';

// export function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   if (!user) return null;

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <aside className="w-64 bg-slate-900 text-white p-6">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold">WeatherGuard</h1>
//           <p className="text-sm text-gray-400">Admin Panel</p>
//         </div>

//         <nav className="space-y-2">
//           <NavLink href="/dashboard" label="Dashboard" />
//           <NavLink href="/dashboard/users" label="Users" />
//           <NavLink href="/dashboard/alerts" label="Weather Alerts" />
//           <NavLink href="/dashboard/audit" label="Audit Logs" />
//         </nav>

//         <div className="absolute bottom-6 left-6 right-6">
//           <div className="bg-slate-800 rounded p-4 mb-4">
//             <p className="text-sm text-gray-400">Logged in as</p>
//             <p className="text-white font-medium truncate">{user.name}</p>
//             <p className="text-xs text-gray-500">{user.role}</p>
//           </div>
//           <button
//             onClick={logout}
//             className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 overflow-auto">
//         <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
//         </header>
//         <div className="p-8">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }

// function NavLink({ href, label }: { href: string; label: string }) {
//   const path = window.location.pathname;
//   const isActive = path === href || path.startsWith(href + '/');

//   return (
//     <a
//       href={href}
//       className={`block px-4 py-2 rounded ${
//         isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-800'
//       }`}
//     >
//       {label}
//     </a>
//   );
// }
import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">WeatherGuard</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          <NavLink href="/dashboard" label="Dashboard" />
          {user.role === "admin" && (
            <>
              <NavLink href="/dashboard/users" label="Users" />
              <NavLink href="/dashboard/alerts" label="Weather Alerts" />
              <NavLink href="/dashboard/audit" label="Audit Logs" />
            </>
          )}
          <NavLink href="/dashboard/settings" label="Settings" />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-800 rounded p-4 mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="text-white font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const path = window.location.pathname;
  const isActive = path === href || path.startsWith(href + "/");

  return (
    <a
      href={href}
      className={`block px-4 py-2 rounded ${
        isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
      }`}
    >
      {label}
    </a>
  );
}
