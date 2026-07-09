import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface CurrentWeather {
  city: string;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeedKmh: number | null;
  wouldTriggerAlert: boolean;
  alertReason: string | null;
  error?: string;
}

export function useCurrentWeather(enabled: boolean) {
  return useQuery<CurrentWeather>({
    queryKey: ['my-weather'],
    queryFn: async () => {
      const response = await api.get('/weather/me');
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
}

export function useTriggerWeatherCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/weather/trigger');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-weather'] });
    },
  });
}
