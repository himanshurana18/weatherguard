// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import api from '../lib/api';
// import { User } from './useAuth';

// export function useUsers(status?: string) {
//   return useQuery<User[]>({
//     queryKey: ['users', status],
//     queryFn: async () => {
//       const response = await api.get('/users', { params: status ? { status } : {} });
//       return response.data;
//     },
//   });
// }

// export function useStats() {
//   return useQuery<{ total: number; pending: number; approved: number; rejected: number }>({
//     queryKey: ['stats'],
//     queryFn: async () => {
//       const response = await api.get('/users/stats');
//       return response.data;
//     },
//   });
// }

// export function useApproveUser() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (userId: string) => {
//       const response = await api.patch(`/users/${userId}/approve`);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//       queryClient.invalidateQueries({ queryKey: ['stats'] });
//     },
//   });
// }

// export function useRejectUser() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
//       const response = await api.patch(`/users/${userId}/reject`, { reason });
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//       queryClient.invalidateQueries({ queryKey: ['stats'] });
//     },
//   });
// }
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { User } from "./useAuth";

export function useUsers(status?: string) {
  return useQuery<User[]>({
    queryKey: ["users", status],
    queryFn: async () => {
      const response = await api.get("/users", {
        params: status ? { status } : {},
      });
      return response.data;
    },
  });
}

export function useStats() {
  return useQuery<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await api.get("/users/stats");
      return response.data;
    },
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.patch(`/users/${userId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useRejectUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      reason,
    }: {
      userId: string;
      reason?: string;
    }) => {
      const response = await api.patch(`/users/${userId}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useLinkTelegram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      telegramChatId,
      telegramUsername,
    }: {
      userId: string;
      telegramChatId: string;
      telegramUsername?: string;
    }) => {
      const response = await api.patch(`/users/${userId}/telegram`, {
        telegramChatId,
        telegramUsername,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, city }: { userId: string; city: string }) => {
      const response = await api.patch(`/users/${userId}/location`, { city });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
