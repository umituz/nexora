import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const FILTERS = ["All", "Unread", "Starred", "Important"];

function EmailRow({ email, index, onPress, onStar }: { email: any; index: number; onPress: () => void; onStar: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()} style={animStyle}>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[styles.emailRow, !email.read && styles.emailRowUnread]}
      >
        <View style={[styles.avatar, { backgroundColor: email.important ? Colors.danger + "30" : Colors.bgElevated }]}>
          <Text style={[styles.avatarText, { color: email.important ? Colors.danger : Colors.textSecondary }]}>{email.avatar}</Text>
        </View>
        <View style={styles.emailInfo}>
          <View style={styles.emailHeaderRow}>
            <Text style={[styles.emailFrom, !email.read && styles.emailFromBold]}>{email.from}</Text>
            <Text style={styles.emailTime}>{email.time}</Text>
          </View>
          <Text style={[styles.emailSubject, !email.read && styles.emailSubjectBold]} numberOfLines={1}>{email.subject}</Text>
          <Text style={styles.emailPreview} numberOfLines={1}>{email.preview}</Text>
        </View>
        <Pressable onPress={(e) => { e.stopPropagation(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onStar(); }} style={styles.starBtn}>
          <Ionicons name={email.starred ? "star" : "star-outline"} size={16} color={email.starred ? Colors.warning : Colors.textDim} />
        </Pressable>
        {!email.read && <View style={styles.unreadDot} />}
      </Pressable>
    </Animated.View>
  );
}

export default function EmailInboxScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { emails, markEmailRead, toggleEmailStar, unreadEmailCount } = useApp();
  const [filter, setFilter] = useState("All");

  const filtered = emails.filter((e) => {
    if (filter === "Unread") return !e.read;
    if (filter === "Starred") return e.starred;
    if (filter === "Important") return e.important;
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <View>
          <Text style={styles.title}>Inbox</Text>
          {unreadEmailCount > 0 && <Text style={styles.subtitle}>{unreadEmailCount} unread</Text>}
        </View>
        <Pressable onPress={() => Alert.alert("Compose Email", "Email composer coming soon.")} style={styles.composeBtn}>
          <Ionicons name="create-outline" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable key={f} onPress={() => { Haptics.selectionAsync(); setFilter(f); }} style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <EmailRow
            email={item}
            index={index}
            onPress={() => { markEmailRead(item.id); router.push({ pathname: "/email/[id]", params: { id: item.id } }); }}
            onStar={() => toggleEmailStar(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="mail-open-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyText}>No emails</Text>
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
  composeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  filterRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  filterBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  filterTextActive: { color: "#fff" },
  emailRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  emailRowUnread: { backgroundColor: Colors.bgSurface + "80" },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 15 },
  emailInfo: { flex: 1 },
  emailHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  emailFrom: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
  emailFromBold: { fontFamily: "Inter_600SemiBold", color: Colors.text },
  emailTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textDim },
  emailSubject: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary, marginBottom: 2 },
  emailSubjectBold: { fontFamily: "Inter_600SemiBold", color: Colors.text },
  emailPreview: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textDim },
  starBtn: { padding: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.textSecondary },
});
