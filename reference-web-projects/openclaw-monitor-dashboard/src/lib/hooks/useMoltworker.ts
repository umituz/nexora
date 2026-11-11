/**
 * React hooks for Moltworker API integration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moltworkerAPI, MoltworkerVersion, MoltworkerProcess, MoltworkerLogEntry, MoltworkerSystemHealth } from '../api/moltworker';
import { useState, useEffect, useRef } from 'react';

// ===== Hook: Version Information =====

export const useMoltworkerVersion = () => {
  return useQuery({
    queryKey: ['moltworker', 'version'],
    queryFn: () => moltworkerAPI.getVersion(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes
  });
};

// ===== Hook: System Health =====

export const useMoltworkerHealth = () => {
  return useQuery<MoltworkerSystemHealth>({
    queryKey: ['moltworker', 'health'],
    queryFn: () => moltworkerAPI.getSystemHealth(),
    staleTime: 1000 * 10, // 10 seconds
    retry: 3,
    refetchInterval: 1000 * 15, // Refresh every 15 seconds
  });
};

// ===== Hook: Processes =====

export const useMoltworkerProcesses = () => {
  return useQuery<MoltworkerProcess[]>({
    queryKey: ['moltworker', 'processes'],
    queryFn: () => moltworkerAPI.getProcesses(),
    staleTime: 1000 * 5, // 5 seconds
    retry: 3,
    refetchInterval: 1000 * 10, // Refresh every 10 seconds
  });
};

// ===== Hook: Logs =====

export const useMoltworkerLogs = (processId: string, limit: number = 100) => {
  return useQuery<MoltworkerLogEntry[]>({
    queryKey: ['moltworker', 'logs', processId, limit],
    queryFn: () => moltworkerAPI.getLogs(processId, limit),
    staleTime: 1000 * 5, // 5 seconds
    retry: 3,
    refetchInterval: 1000 * 10, // Refresh every 10 seconds
    enabled: !!processId,
  });
};

// ===== Hook: Restart Gateway =====

export const useRestartGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => moltworkerAPI.restartGateway(),
    onSuccess: () => {
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['moltworker'] });
    },
  });
};

// ===== Hook: Trigger Backup =====

export const useTriggerBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => moltworkerAPI.triggerBackup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moltworker'] });
    },
  });
};

// ===== Hook: WebSocket Connection =====

export interface WebSocketMessage {
  type: 'log' | 'status' | 'error' | 'agent' | 'system' | 'warning';
  content: string;
  timestamp: string;
  session?: string;
  processId?: string;
  level?: 'info' | 'warn' | 'error' | 'debug';
}

export const useMoltworkerWebSocket = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const MAX_MESSAGES = 100; // Keep last 100 messages

  const connect = () => {
    try {
      // Import buildWebSocketUrl dynamically to avoid circular dependencies
      const { buildWebSocketUrl } = require('../config');
      const wsUrl = buildWebSocketUrl();

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          setMessages((prev) => {
            const newMessages = [...prev, data];
            // Keep only the last MAX_MESSAGES
            return newMessages.slice(-MAX_MESSAGES);
          });
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected, attempting to reconnect...');

        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };

      return ws;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);

      // Retry connection after 10 seconds on error
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 10000);
    }
  };

  useEffect(() => {
    const ws = connect();

    return () => {
      // Cleanup
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isConnected,
    error,
    clearMessages,
  };
};

// ===== Hook: Paired Devices =====

export const usePairedDevices = () => {
  return useQuery({
    queryKey: ['moltworker', 'devices'],
    queryFn: () => moltworkerAPI.getPairedDevices(),
    staleTime: 1000 * 30, // 30 seconds
    retry: 2,
    refetchInterval: 1000 * 60, // Refresh every minute
  });
};
