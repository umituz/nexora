import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const PERIODS = ["7D", "30D", "90D", "1Y"];

function BarChart({ data, color, maxVal }: { data: number[]; color: string; maxVal: number }) {
  return (
    <View style={styles.barChart}>
      {data.map((val, i) => {
        const height = maxVal > 0 ? Math.max(4, (val / maxVal) * 80) : 4;
        return (
          <Animated.View key={i} entering={FadeInRight.delay(i * 40).springify()} style={styles.barWrapper}>
            <View style={[styles.bar, { height, backgroundColor: color }]} />
          </Animated.View>
        );
      })}
    </View>
  );
}

function MetricBig({ label, value, delta, icon, color }: { label: string; value: string; delta: string; icon: string; color: string }) {
  const isPositive = delta.startsWith("+");
  return (
    <View style={[styles.metricBig, { borderLeftColor: color }]}>
      <View style={[styles.metricBigIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.metricBigLabel}>{label}</Text>
        <Text style={styles.metricBigValue}>{value}</Text>
      </View>
      <View style={[styles.deltaBadge, { backgroundColor: isPositive ? Colors.success + "20" : Colors.danger + "20" }]}>
        <Ionicons name={isPositive ? "trending-up-outline" : "trending-down-outline"} size={11} color={isPositive ? Colors.success : Colors.danger} />
        <Text style={[styles.deltaText, { color: isPositive ? Colors.success : Colors.danger }]}>{delta}</Text>
      </View>
    </View>
  );
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { analytics } = useApp();
  const [period, setPeriod] = useState("7D");

  const data = analytics[period] || analytics["7D"];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <Pressable key={p} onPress={() => setPeriod(p)} style={[styles.periodBtn, period === p && styles.periodBtnActive]}>
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Ionicons name="sparkles" size={14} color={Colors.accent} />
            <Text style={styles.scoreTitle}>Productivity Score</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreValue}>{data.productivityScore}</Text>
            <View style={styles.scoreTrend}>
              <Ionicons name="trending-up-outline" size={16} color={Colors.success} />
              <Text style={styles.scoreTrendText}>+{data.productivityDelta}% vs last period</Text>
            </View>
          </View>
          <BarChart data={data.dailyScores} color={Colors.accent} maxVal={100} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.metricsGrid}>
          <MetricBig label="Tasks Done" value={`${data.tasksDone}`} delta={`+${data.tasksDelta}`} icon="checkmark-done-outline" color={Colors.success} />
          <MetricBig label="Focus Time" value={`${data.focusHours}h`} delta={`+${data.focusDelta}h`} icon="timer-outline" color={Colors.accent} />
          <MetricBig label="Habits Streak" value={`${data.habitStreak} days`} delta={data.habitDelta > 0 ? `+${data.habitDelta}` : `${data.habitDelta}`} icon="flame-outline" color={Colors.warning} />
          <MetricBig label="Mood Avg" value={data.avgMood} delta={data.moodDelta} icon="happy-outline" color={Colors.accentViolet} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {data.categories.map((cat: any, i: number) => (
            <View key={i} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryName}>{cat.name}</Text>
              <View style={styles.categoryBar}>
                <View style={[styles.categoryBarFill, { width: `${cat.pct}%` as any, backgroundColor: cat.color }]} />
              </View>
              <Text style={[styles.categoryPct, { color: cat.color }]}>{cat.pct}%</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).springify()} style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Ionicons name="bulb-outline" size={14} color={Colors.warning} />
            <Text style={styles.insightsTitle}>AI Insights</Text>
          </View>
          {data.insights.map((insight: string, i: number) => (
            <View key={i} style={styles.insightRow}>
              <View style={styles.insightDot} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  periodRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  periodBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  periodBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  periodText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.textSecondary },
  periodTextActive: { color: "#fff" },
  scoreCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, gap: 8 },
  scoreHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  scoreTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.accent },
  scoreRow: { flexDirection: "row", alignItems: "baseline", gap: 12 },
  scoreValue: { fontFamily: "Inter_700Bold", fontSize: 48, color: Colors.text, letterSpacing: -2 },
  scoreTrend: { flexDirection: "row", alignItems: "center", gap: 4 },
  scoreTrendText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.success },
  barChart: { flexDirection: "row", alignItems: "flex-end", height: 80, gap: 4 },
  barWrapper: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 3 },
  metricsGrid: { gap: 8, marginBottom: 14 },
  metricBig: { backgroundColor: Colors.bgSurface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3, flexDirection: "row", alignItems: "center", gap: 12 },
  metricBigIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  metricBigLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  metricBigValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text, marginTop: 1 },
  deltaBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  deltaText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  section: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, gap: 10 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text, marginBottom: 4 },
  categoryRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  categoryName: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.text, width: 80 },
  categoryBar: { flex: 1, height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  categoryBarFill: { height: 5, borderRadius: 3 },
  categoryPct: { fontFamily: "Inter_600SemiBold", fontSize: 12, width: 36, textAlign: "right" },
  insightsCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 8 },
  insightsHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  insightsTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.warning },
  insightRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  insightDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.warning, marginTop: 6 },
  insightText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
});
