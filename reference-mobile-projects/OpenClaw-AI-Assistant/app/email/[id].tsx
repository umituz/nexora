import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function EmailDetailScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { id } = useLocalSearchParams<{ id: string }>();
  const { emails, toggleEmailStar } = useApp();
  const email = emails.find((e) => e.id === id);
  if (!email) return null;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleEmailStar(id); }}>
            <Ionicons name={email.starred ? "star" : "star-outline"} size={20} color={email.starred ? Colors.warning : Colors.textSecondary} />
          </Pressable>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Alert.alert("Archive", "Email archived."); router.back(); }}><Ionicons name="archive-outline" size={20} color={Colors.textSecondary} /></Pressable>
          <Pressable onPress={() => Alert.alert("Delete email", "This email will be deleted.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => router.back() }])}><Ionicons name="trash-outline" size={20} color={Colors.danger} /></Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <Text style={styles.subject}>{email.subject}</Text>
          <View style={styles.senderRow}>
            <View style={[styles.avatar, { backgroundColor: email.important ? Colors.danger + "20" : Colors.bgElevated }]}>
              <Text style={[styles.avatarText, { color: email.important ? Colors.danger : Colors.textSecondary }]}>{email.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.senderName}>{email.from}</Text>
              <Text style={styles.senderEmail}>{email.fromEmail}</Text>
            </View>
            <Text style={styles.emailTime}>{email.date}</Text>
          </View>

          {email.important && (
            <View style={styles.importantBanner}>
              <Ionicons name="warning-outline" size={14} color={Colors.warning} />
              <Text style={styles.importantText}>Marked as important</Text>
            </View>
          )}

          <View style={styles.bodyCard}>
            <Text style={styles.body}>{email.body}</Text>
          </View>

          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={14} color={Colors.accent} />
              <Text style={styles.aiTitle}>Aria AI Summary</Text>
            </View>
            <Text style={styles.aiText}>This email requires your attention. {email.important ? "It contains urgent or time-sensitive information. " : ""}Key action: review and respond within 24 hours.</Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <View style={[styles.replyBar, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={styles.replyBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
          <Ionicons name="return-up-back-outline" size={16} color={Colors.accent} />
          <Text style={styles.replyBtnText}>Reply</Text>
        </Pressable>
        <Pressable style={[styles.replyBtn, styles.aiReplyBtn]} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
          <Ionicons name="sparkles" size={16} color="#fff" />
          <Text style={[styles.replyBtnText, { color: "#fff" }]}>AI Reply</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 16 },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  subject: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text, letterSpacing: -0.3, marginBottom: 16 },
  senderRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 15 },
  senderName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  senderEmail: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  emailTime: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textDim },
  importantBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Colors.warning + "15", borderRadius: 10, padding: 10, marginBottom: 14, borderWidth: 1, borderColor: Colors.warning + "30" },
  importantText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.warning },
  bodyCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  body: { fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },
  aiCard: { backgroundColor: Colors.accentGlow, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.accent + "30", gap: 6 },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  aiTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.accent },
  aiText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  replyBar: { flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  replyBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: Colors.bgSurface, borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: Colors.border },
  aiReplyBtn: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  replyBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.accent },
});
