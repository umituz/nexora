import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import { mockData } from "@/data/mockData";
import { STORAGE_KEYS } from "@/constants/app";
import { getItem, setItem } from "@/lib/storage";
import type {
  Song, DuplicateGroup, SplitAlbumGroup, ActionHistoryItem, Notification,
} from "@/data/types";

interface LibraryState {
  songs: Song[];
  duplicates: DuplicateGroup[];
  splitAlbums: SplitAlbumGroup[];
  deletionQueueIds: string[];
  history: ActionHistoryItem[];
  notifications: Notification[];
}

interface LibraryContextValue extends LibraryState {
  toggleFavorite: (id: string) => void;
  favoriteMany: (ids: string[]) => void;
  queueForDeletion: (ids: string[]) => void;
  restoreFromQueue: (id: string) => void;
  emptyDeletionQueue: () => void;
  mergeDuplicate: (groupId: string) => void;
  mergeAllDuplicates: () => void;
  unifySplitAlbum: (groupId: string) => void;
  unifyAllSplitAlbums: () => void;
  undoHistory: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  pushNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  resetLibrary: () => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

const initial = (): LibraryState => ({
  songs: getItem<Song[]>(STORAGE_KEYS.LIBRARY, mockData.songs),
  duplicates: getItem<DuplicateGroup[]>("songsweeper-duplicates", mockData.duplicates),
  splitAlbums: getItem<SplitAlbumGroup[]>("songsweeper-split-albums", mockData.splitAlbums),
  deletionQueueIds: getItem<string[]>(STORAGE_KEYS.DELETION_QUEUE, []),
  history: getItem<ActionHistoryItem[]>(STORAGE_KEYS.ACTION_HISTORY, mockData.actionHistory),
  notifications: getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, mockData.notifications),
});

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LibraryState>(initial);

  useEffect(() => { setItem(STORAGE_KEYS.LIBRARY, state.songs); }, [state.songs]);
  useEffect(() => { setItem("songsweeper-duplicates", state.duplicates); }, [state.duplicates]);
  useEffect(() => { setItem("songsweeper-split-albums", state.splitAlbums); }, [state.splitAlbums]);
  useEffect(() => { setItem(STORAGE_KEYS.DELETION_QUEUE, state.deletionQueueIds); }, [state.deletionQueueIds]);
  useEffect(() => { setItem(STORAGE_KEYS.ACTION_HISTORY, state.history); }, [state.history]);
  useEffect(() => { setItem(STORAGE_KEYS.NOTIFICATIONS, state.notifications); }, [state.notifications]);

  const logHistory = useCallback((entry: Omit<ActionHistoryItem, "id" | "timestamp">) => {
    setState((prev) => ({
      ...prev,
      history: [{ ...entry, id: makeId("ah"), timestamp: new Date().toISOString() }, ...prev.history],
    }));
  }, []);

  const pushNotification = useCallback((n: Omit<Notification, "id" | "timestamp" | "read">) => {
    setState((prev) => ({
      ...prev,
      notifications: [{ ...n, id: makeId("n"), timestamp: new Date().toISOString(), read: false }, ...prev.notifications],
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState((prev) => {
      const target = prev.songs.find((s) => s.id === id);
      if (!target) return prev;
      return {
        ...prev,
        songs: prev.songs.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)),
      };
    });
  }, []);

  const favoriteMany = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    setState((prev) => ({
      ...prev,
      songs: prev.songs.map((s) => (ids.includes(s.id) ? { ...s, isFavorite: true } : s)),
    }));
    logHistory({ action: "favorite", description: `Favorited ${ids.length} songs`, itemCount: ids.length, undoable: true });
  }, [logHistory]);

  const queueForDeletion = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    setState((prev) => {
      const next = Array.from(new Set([...prev.deletionQueueIds, ...ids]));
      return { ...prev, deletionQueueIds: next };
    });
    logHistory({ action: "delete", description: `Queued ${ids.length} song(s) for deletion`, itemCount: ids.length, undoable: true });
  }, [logHistory]);

  const restoreFromQueue = useCallback((id: string) => {
    setState((prev) => ({ ...prev, deletionQueueIds: prev.deletionQueueIds.filter((q) => q !== id) }));
  }, []);

  const emptyDeletionQueue = useCallback(() => {
    setState((prev) => {
      const count = prev.deletionQueueIds.length;
      if (count === 0) return prev;
      const removeSet = new Set(prev.deletionQueueIds);
      return {
        ...prev,
        songs: prev.songs.filter((s) => !removeSet.has(s.id)),
        deletionQueueIds: [],
        history: [{
          id: makeId("ah"),
          timestamp: new Date().toISOString(),
          action: "delete",
          description: `Removed ${count} songs from library`,
          itemCount: count,
          undoable: false,
        }, ...prev.history],
      };
    });
  }, []);

  const mergeDuplicate = useCallback((groupId: string) => {
    setState((prev) => ({
      ...prev,
      duplicates: prev.duplicates.map((g) => (g.id === groupId ? { ...g, resolved: true } : g)),
    }));
    logHistory({ action: "merge", description: "Merged 1 duplicate group", itemCount: 1, undoable: true });
  }, [logHistory]);

  const mergeAllDuplicates = useCallback(() => {
    setState((prev) => {
      const count = prev.duplicates.filter((g) => !g.resolved).length;
      if (count === 0) return prev;
      return {
        ...prev,
        duplicates: prev.duplicates.map((g) => ({ ...g, resolved: true })),
        history: [{
          id: makeId("ah"), timestamp: new Date().toISOString(),
          action: "merge", description: `Merged ${count} duplicate groups`, itemCount: count, undoable: true,
        }, ...prev.history],
      };
    });
  }, []);

  const unifySplitAlbum = useCallback((groupId: string) => {
    setState((prev) => ({
      ...prev,
      splitAlbums: prev.splitAlbums.map((g) => (g.id === groupId ? { ...g, unified: true } : g)),
    }));
    logHistory({ action: "unify", description: "Unified 1 split album", itemCount: 1, undoable: true });
  }, [logHistory]);

  const unifyAllSplitAlbums = useCallback(() => {
    setState((prev) => {
      const count = prev.splitAlbums.filter((g) => !g.unified).length;
      if (count === 0) return prev;
      return {
        ...prev,
        splitAlbums: prev.splitAlbums.map((g) => ({ ...g, unified: true })),
        history: [{
          id: makeId("ah"), timestamp: new Date().toISOString(),
          action: "unify", description: `Unified ${count} split albums`, itemCount: count, undoable: true,
        }, ...prev.history],
      };
    });
  }, []);

  const undoHistory = useCallback((id: string) => {
    setState((prev) => ({ ...prev, history: prev.history.filter((h) => h.id !== id) }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({ ...prev, notifications: prev.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setState((prev) => ({ ...prev, notifications: prev.notifications.filter((n) => n.id !== id) }));
  }, []);

  const resetLibrary = useCallback(() => {
    setState({
      songs: mockData.songs,
      duplicates: mockData.duplicates,
      splitAlbums: mockData.splitAlbums,
      deletionQueueIds: [],
      history: mockData.actionHistory,
      notifications: mockData.notifications,
    });
  }, []);

  const value = useMemo<LibraryContextValue>(() => ({
    ...state,
    toggleFavorite, favoriteMany, queueForDeletion, restoreFromQueue, emptyDeletionQueue,
    mergeDuplicate, mergeAllDuplicates, unifySplitAlbum, unifyAllSplitAlbums,
    undoHistory, markNotificationRead, markAllNotificationsRead, deleteNotification,
    pushNotification, resetLibrary,
  }), [state, toggleFavorite, favoriteMany, queueForDeletion, restoreFromQueue, emptyDeletionQueue,
        mergeDuplicate, mergeAllDuplicates, unifySplitAlbum, unifyAllSplitAlbums,
        undoHistory, markNotificationRead, markAllNotificationsRead, deleteNotification,
        pushNotification, resetLibrary]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
