import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface AuditLog {
  _id: string;
  action: string;
  performedBy: string;
  targetUser?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export function Audit() {
  const { data: logs, isLoading } = useQuery<AuditLog[]>({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await api.get('/audit/logs');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading audit logs...</div>;

  const actionColor = (action: string) => {
    switch (action) {
      case 'USER_APPROVED':
        return 'bg-green-100 text-green-800';
      case 'USER_REJECTED':
        return 'bg-red-100 text-red-800';
      case 'ALERT_SENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Performed By</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Target</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Metadata</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log) => (
              <tr key={log._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${actionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.performedBy}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.targetUser || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {JSON.stringify(log.metadata || {}).substring(0, 50)}...
                  </code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!logs?.length && <div className="text-center py-8 text-gray-600">No audit logs found</div>}
    </div>
  );
}
