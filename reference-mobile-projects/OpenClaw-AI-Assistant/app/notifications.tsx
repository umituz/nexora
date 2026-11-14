import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const NOTIF_ICONS: Record<string, { icon: string; color: string }> = {
  task: { icon: "checkmark-circle-outline", color: Colors.success },
  email: { icon: "mail-outline", color: Colors.accent },
  reminder: { icon: "alarm-outline", color: Colors.warning },
  ai: { icon: "sparkles", color: Colors.accentViolet },
  health: { icon: "heart-outline", color: Colors.danger },
  finance: { icon: "card-outline", color: Colors.accentCyan },
  system: { icon: "settings-outline", color: Colors.textSecondary },
};

function NotifRow({ notif, index, onRead }: { notif: any; index: number; onRead: () => void }) {
  const typeStyle = NOTIF_ICONS[notif.type] || NOTIF_ICONS.system;
  return (
    <Animated.View entering={FadeInDown.delay(index * 35).springify()}>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onRead(); }}
        style={[styles.notifRow, !notif.read && styles.notifRowUnread]}
      >
        <View style={[styles.notifIcon, { backgroundColor: typeStyle.color + "20" }]}>
          <Ionicons name={typeStyle.icon as any} size={18} color={typeStyle.color} />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>{notif.title}</Text>
          <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
          <Text style={styles.notifTime}>{notif.time}</Text>
        </View>
        {!notif.read && <View style={[styles.unreadDot, { backgroundColor: typeStyle.color }]} />}
      </Pressable>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount } = useApp();

  const today = notifications.filter((n) => n.group === "today");
  const earlier = notifications.filter((n) => n.group !== "today");

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unreadNotificationCount > 0 && <Text style={styles.subtitle}>{unreadNotificationCount} unread</Text>}
        </View>
        {unreadNotificationCount > 0 && (
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); markAllNotificationsRead(); }} style={styles.readAllBtn}>
            <Text style={styles.readAllText}>Read all</Text>
          </Pressable>
        )}
        {unreadNotificationCount === 0 && <View style={{ width: 60 }} />}
      </View>

      <FlatList
        data={[...today, ...earlier]}
        keyExtractor={(n) => n.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          today.length > 0 ? (
            <Text style={[styles.groupLabel, { paddingHorizontal: 20, paddingTop: 4 }]}>Today</Text>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: 20 }}>
            {!item.read && index === today.length && earlier.length > 0 && (
              <Text style={styles.groupLabel}>Earlier</Text>
            )}
            <NotifRow notif={item} index={index} onRead={() => markNotificationRead(item.id)} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  readAllBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  readAllText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.accent },
  groupLabel: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: Colors.textDim, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, marginTop: 8 },
  notifRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  notifRowUnread: { backgroundColor: Colors.bgSurface + "60" },
  notifIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  notifContent: { flex: 1, gap: 2 },
  notifTitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
  notifTitleUnread: { fontFamily: "Inter_600SemiBold", color: Colors.text },
  notifBody: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  notifTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textDim },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  empty: { alignItems: "center", paddingTop: 80, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.textSecondary },
});
