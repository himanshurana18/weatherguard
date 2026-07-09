import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useLinkTelegram, useUpdateLocation } from "../hooks/useUsers";
import { useCurrentWeather } from "../hooks/useWeather";

export function Settings() {
  const { user, refetchUser } = useAuth();
  const linkTelegram = useLinkTelegram();
  const updateLocation = useUpdateLocation();

  const [chatId, setChatId] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");

  const alertsReady = !!user?.telegramChatId && !!user?.location;
  const {
    data: weather,
    isLoading: weatherLoading,
    refetch: refetchWeather,
  } = useCurrentWeather(alertsReady);

  if (!user) return null;

  const handleLinkTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId.trim()) {
      toast.error("Chat ID is required");
      return;
    }
    try {
      await linkTelegram.mutateAsync({
        userId: user._id,
        telegramChatId: chatId.trim(),
        telegramUsername: username.trim() || undefined,
      });
      toast.success("Telegram linked");
      setChatId("");
      setUsername("");
      refetchUser();
    } catch {
      toast.error("Failed to link Telegram");
    }
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      toast.error("City is required");
      return;
    }
    try {
      await updateLocation.mutateAsync({ userId: user._id, city: city.trim() });
      toast.success("Location updated");
      setCity("");
      refetchUser();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update location";
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Settings</h1>
        <p className="text-gray-600 mt-1">
          Link your Telegram and set your city to start receiving weather
          alerts.
        </p>
      </div>

      <div
        className={`rounded-lg p-4 text-sm font-medium ${
          alertsReady
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {alertsReady
          ? "✅ You are all set. Weather alerts will be sent to your Telegram automatically."
          : "⚠️ Alerts are not active yet. Complete both steps below."}
      </div>

      {/* Step 1: Telegram */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            1. Link Telegram
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Open Telegram, search for the WeatherGuard bot, and send{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded">/start</code>. It
            will reply with your Chat ID — paste it below.
          </p>
        </div>

        {user.telegramChatId && (
          <div className="text-sm text-gray-700 bg-gray-50 rounded p-3">
            Currently linked:{" "}
            <span className="font-medium">{user.telegramChatId}</span>
            {user.telegramUsername ? ` (@${user.telegramUsername})` : ""}
          </div>
        )}

        <form onSubmit={handleLinkTelegram} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chat ID
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="e.g. 123456789"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telegram Username (optional)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. yourusername"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={linkTelegram.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {linkTelegram.isPending ? "Linking..." : "Save Telegram"}
          </button>
        </form>
      </div>

      {/* Step 2: Location */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            2. Set Your City
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            We check the weather here every 6 hours and alert you if it turns
            severe.
          </p>
        </div>

        {user.location && (
          <div className="text-sm text-gray-700 bg-gray-50 rounded p-3">
            Current location:{" "}
            <span className="font-medium">{user.location.city}</span>
          </div>
        )}

        <form onSubmit={handleUpdateLocation} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Delhi,IN"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={updateLocation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {updateLocation.isPending ? "Saving..." : "Save Location"}
          </button>
        </form>
      </div>

      {/* Step 3: Live check */}
      {alertsReady && (
        <div className="bg-white rounded-lg shadow p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              3. Current Weather Check
            </h2>
            <button
              onClick={() => refetchWeather()}
              disabled={weatherLoading}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
            >
              {weatherLoading ? "Checking..." : "Refresh"}
            </button>
          </div>

          {weather?.error && (
            <p className="text-sm text-red-600">{weather.error}</p>
          )}

          {weather && !weather.error && (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">{weather.city}</span> —{" "}
                {weather.temp}°C, {weather.description}
              </p>
              <p>
                Humidity: {weather.humidity}% · Wind:{" "}
                {weather.windSpeedKmh?.toFixed(1)} km/h
              </p>
              <p
                className={`font-medium ${
                  weather.wouldTriggerAlert ? "text-red-600" : "text-gray-500"
                }`}
              >
                {weather.wouldTriggerAlert
                  ? `⚠️ This would trigger an alert right now: ${weather.alertReason}`
                  : "No alert right now — weather is within normal range. This is expected, not an error."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
