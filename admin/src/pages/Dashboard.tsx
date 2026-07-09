import { useStats } from '../hooks/useUsers';

export function Dashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={stats?.total || 0} color="bg-blue-500" />
        <StatCard label="Pending Approval" value={stats?.pending || 0} color="bg-yellow-500" />
        <StatCard label="Approved" value={stats?.approved || 0} color="bg-green-500" />
        <StatCard label="Rejected" value={stats?.rejected || 0} color="bg-red-500" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a
            href="/dashboard/users?tab=pending"
            className="block text-blue-600 hover:text-blue-700 font-medium"
          >
            → Review pending user applications
          </a>
          <a href="/dashboard/alerts" className="block text-blue-600 hover:text-blue-700 font-medium">
            → View recent weather alerts
          </a>
          <a href="/dashboard/audit" className="block text-blue-600 hover:text-blue-700 font-medium">
            → Check activity logs
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`${color} rounded-lg shadow p-6 text-white`}>
      <p className="text-sm opacity-90">{label}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
