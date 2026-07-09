import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">WeatherGuard</h1>
          <p className="text-gray-600">Admin Portal</p>
        </div>

        <div className="space-y-4">
          <a
            href={`${apiUrl}/auth/google`}
            className="block w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg text-center transition"
          >
            Sign in with Google
          </a>
          <a
            href={`${apiUrl}/auth/github`}
            className="block w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
          >
            Sign in with GitHub
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-300">
          <p className="text-center text-sm text-gray-600">
            Only approved users can access the admin panel
          </p>
        </div>
      </div>
    </div>
  );
}
