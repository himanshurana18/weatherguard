import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useTriggerWeatherCheck } from '../hooks/useWeather';

export function Alerts() {
  const { user } = useAuth();
  const trigger = useTriggerWeatherCheck();

  const handleTrigger = async () => {
    try {
      const result = await trigger.mutateAsync();
      toast.success(result.message);
    } catch {
      toast.error('Failed to trigger weather check');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Weather Alerts</h1>
        {user?.role === 'admin' && (
          <button
            onClick={handleTrigger}
            disabled={trigger.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {trigger.isPending ? 'Checking...' : 'Trigger Check Now'}
          </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="font-semibold text-blue-900 mb-2">Weather Alert System</h2>
        <p className="text-blue-800 text-sm">
          Weather alerts are sent automatically via Telegram every 6 hours when severe weather
          conditions are detected for approved users with a location set. Admins can use{' '}
          <span className="font-medium">Trigger Check Now</span> to run the check immediately
          instead of waiting for the schedule — useful for testing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <AlertTypeCard type="Rain" icon="🌧️" color="bg-blue-100 text-blue-800" />
        <AlertTypeCard type="Storm" icon="⛈️" color="bg-purple-100 text-purple-800" />
        <AlertTypeCard type="Heat" icon="🌡️" color="bg-red-100 text-red-800" />
        <AlertTypeCard type="Cold" icon="❄️" color="bg-cyan-100 text-cyan-800" />
        <AlertTypeCard type="Wind" icon="💨" color="bg-yellow-100 text-yellow-800" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Alert Thresholds</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>
            <span className="font-semibold">Rain:</span> Triggered when rain conditions detected
          </li>
          <li>
            <span className="font-semibold">Thunderstorm:</span> Triggered when thunderstorm
            conditions detected
          </li>
          <li>
            <span className="font-semibold">Extreme Heat:</span> Triggered when temperature
            exceeds 40°C
          </li>
          <li>
            <span className="font-semibold">Extreme Cold:</span> Triggered when temperature drops
            below 5°C
          </li>
          <li>
            <span className="font-semibold">High Wind:</span> Triggered when wind speed exceeds 50
            km/h
          </li>
        </ul>
      </div>
    </div>
  );
}

function AlertTypeCard({ type, icon, color }: { type: string; icon: string; color: string }) {
  return (
    <div className={`${color} rounded-lg p-4 text-center`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-semibold text-sm">{type}</div>
    </div>
  );
}
