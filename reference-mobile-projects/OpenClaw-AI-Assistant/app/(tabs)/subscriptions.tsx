import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { router } from "expo-router";

const STATUS_COLORS = {
  active: Colors.success,
  paused: Colors.warning,
  cancelled: Colors.danger,
};

function SubCard({ sub, index, onToggleReminder }: { sub: any; index: number; onToggleReminder: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()} style={animStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[styles.subCard, sub.expensive && styles.subCardExpensive]}
      >
        <View style={styles.subLeft}>
          <View style={[styles.subLogo, { backgroundColor: sub.expensive ? Colors.danger + "20" : Colors.bgElevated }]}>
            <Ionicons name={sub.logo as any} size={20} color={sub.expensive ? Colors.danger : Colors.textSecondary} />
          </View>
          <View style={styles.subInfo}>
            <View style={styles.subNameRow}>
              <Text style={styles.subName}>{sub.name}</Text>
              {sub.expensive && (
                <View style={styles.expensiveBadge}>
                  <Ionicons name="warning-outline" size={10} color={Colors.danger} />
                  <Text style={styles.expensiveText}>High cost</Text>
                </View>
              )}
            </View>
            <Text style={styles.subCategory}>{sub.category} · Renews {sub.nextBilling}</Text>
          </View>
        </View>
        <View style={styles.subRight}>
          <Text style={styles.subPrice}>${sub.price.toFixed(2)}</Text>
          <Text style={styles.subCycle}>/{sub.billingCycle === "monthly" ? "mo" : "yr"}</Text>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[sub.status as keyof typeof STATUS_COLORS] }]} />
        </View>
      </Pressable>
      {sub.expensive && (
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onToggleReminder(); }}
          style={[styles.reminderRow, sub.cancelReminder && styles.reminderRowActive]}
        >
          <Ionicons
            name={sub.cancelReminder ? "alarm" : "alarm-outline"}
            size={14}
            color={sub.cancelReminder ? Colors.accent : Colors.textSecondary}
          />
          <Text style={[styles.reminderText, sub.cancelReminder && { color: Colors.accent }]}>
            {sub.cancelReminder ? "Cancel reminder set" : "Set cancel reminder"}
          </Text>
          <Ionicons name="chevron-forward" size={12} color={Colors.textDim} />
        </Pressable>
      )}
    </Animated.View>
  );
}

export default function SubscriptionsScreen() {
  const insets = useSafeAreaInsets();
  const { subscriptions, totalMonthlySpend, toggleCancelReminder, createConversation, sendMessage, setActiveConversationId } = useApp();
  const [filter, setFilter] = useState<"all" | "expensive" | "active">("all");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = useMemo(() => {
    if (filter === "expensive") return subscriptions.filter((s) => s.expensive);
    if (filter === "active") return subscriptions.filter((s) => s.status === "active");
    return subscriptions;
  }, [subscriptions, filter]);

  const expensiveCount = subscriptions.filter((s) => s.expensive).length;
  const annualSpend = totalMonthlySpend * 12;

  const handleAIAnalyze = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const id = createConversation();
    setActiveConversationId(id);
    router.push({ pathname: "/chat/[id]", params: { id } });
    setTimeout(() => {
      sendMessage(id, "Check my subscriptions, list the expensive ones, and schedule reminders to cancel unnecessary ones.");
    }, 300);
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Finance</Text>
        <Pressable onPress={handleAIAnalyze} style={styles.aiBtn}>
          <Ionicons name="sparkles" size={14} color={Colors.accent} />
          <Text style={styles.aiBtnText}>Analyze</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>${totalMonthlySpend.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Monthly</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>${annualSpend.toFixed(0)}</Text>
            <Text style={styles.summaryLabel}>Annual</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.danger }]}>{expensiveCount}</Text>
            <Text style={styles.summaryLabel}>High cost</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{subscriptions.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.filterRow}>
          {(["all", "expensive", "active"] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        {expensiveCount > 0 && filter !== "active" && (
          <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.alertBanner}>
            <Ionicons name="warning-outline" size={16} color={Colors.warning} />
            <Text style={styles.alertText}>
              <Text style={{ color: Colors.warning, fontFamily: "Inter_600SemiBold" }}>{expensiveCount} subscriptions</Text> flagged as expensive. Tap "Analyze" to get AI recommendations.
            </Text>
          </Animated.View>
        )}

        <View style={styles.listContainer}>
          {filtered.map((sub, i) => (
            <SubCard key={sub.id} sub={sub} index={i} onToggleReminder={() => toggleCancelReminder(sub.id)} />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text, letterSpacing: -0.5 },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.accent + "50",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  aiBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.accent },
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  summaryCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, height: 36, backgroundColor: Colors.border },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  filterTextActive: { color: "#fff" },

  alertBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.warning + "10",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.warning + "30",
    marginBottom: 14,
  },
  alertText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  listContainer: { gap: 0 },

  subCard: {
    backgroundColor: Colors.bgSurface,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginTop: 10,
  },
  subCardExpensive: {
    borderColor: Colors.danger + "30",
  },
  subLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  subLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  subInfo: { flex: 1 },
  subNameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  subName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  expensiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.danger + "15",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  expensiveText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: Colors.danger },
  subCategory: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  subRight: { alignItems: "flex-end", gap: 2 },
  subPrice: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.text },
  subCycle: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textDim },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginTop: 4 },

  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.bgElevated,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  reminderRowActive: {
    borderColor: Colors.accent + "50",
    backgroundColor: Colors.accentGlow,
  },
  reminderText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
});
