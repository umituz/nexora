import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const WEEKLY_STEPS = [4200, 8100, 6500, 9200, 7842, 0, 0];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MAX_STEPS = 10000;

function MetricCard({ metric, index }: { metric: any; index: number }) {
  const trendColor = metric.trend === "up" ? Colors.success : metric.trend === "down" ? Colors.danger : Colors.textSecondary;
  const trendIcon = metric.trend === "up" ? "trending-up" : metric.trend === "down" ? "trending-down" : "remove-outline";
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()} style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: metric.color + "20" }]}>
        <Ionicons name={metric.icon as any} size={18} color={metric.color} />
      </View>
      <Text style={styles.metricValue}>{metric.value}</Text>
      <Text style={styles.metricUnit}>{metric.unit}</Text>
      <Text style={styles.metricLabel}>{metric.label}</Text>
      <View style={styles.trendRow}>
        <Ionicons name={trendIcon as any} size={12} color={trendColor} />
        <Text style={[styles.trendText, { color: trendColor }]}>{metric.trendValue}</Text>
      </View>
    </Animated.View>
  );
}

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { healthMetrics, habits } = useApp();
  const habitsDone = habits.filter((h) => h.completedToday).length;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Health</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreTitle}>Health Score</Text>
            <Text style={styles.scoreSub}>Today · {habitsDone} habits done</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>82</Text>
            <Text style={styles.scoreUnit}>/ 100</Text>
          </View>
        </Animated.View>

        <View style={styles.metricsGrid}>
          {healthMetrics.map((m, i) => <MetricCard key={m.id} metric={m} index={i} />)}
        </View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.stepsCard}>
          <Text style={styles.sectionTitle}>Weekly Steps</Text>
          <View style={styles.stepsChart}>
            {WEEKLY_STEPS.map((steps, i) => {
              const height = steps > 0 ? Math.max(8, (steps / MAX_STEPS) * 80) : 4;
              const color = steps >= MAX_STEPS ? Colors.success : steps >= 7000 ? Colors.accent : steps > 0 ? Colors.warning : Colors.border;
              return (
                <Animated.View key={i} entering={FadeInRight.delay(i * 60).springify()} style={styles.barWrapper}>
                  <View style={[styles.bar, { height, backgroundColor: color }]} />
                  <Text style={styles.barDay}>{DAYS[i]}</Text>
                  <Text style={styles.barSteps}>{steps > 0 ? (steps / 1000).toFixed(1) + "k" : "-"}</Text>
                </Animated.View>
              );
            })}
          </View>
          <Text style={styles.stepsGoal}>Daily goal: 10,000 steps</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(360).springify()} style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="sparkles" size={14} color={Colors.accent} />
            <Text style={styles.tipsTitle}>AI Health Tips</Text>
          </View>
          {["Drink 600ml more water to hit your daily goal", "You're 2,158 steps short of today's goal", "Sleep last night was excellent — keep it consistent", "Consider a short walk after lunch to boost afternoon energy"].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
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
  scoreCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: Colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  scoreLeft: { gap: 4 },
  scoreTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: Colors.text },
  scoreSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  scoreCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.success + "20", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: Colors.success },
  scoreValue: { fontFamily: "Inter_700Bold", fontSize: 22, color: Colors.success },
  scoreUnit: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  metricCard: { width: "30.5%", backgroundColor: Colors.bgSurface, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: Colors.border, gap: 3, alignItems: "center" },
  metricIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  metricValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  metricUnit: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary },
  metricLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textDim, textAlign: "center" },
  trendRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  trendText: { fontFamily: "Inter_500Medium", fontSize: 10 },
  stepsCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text, marginBottom: 16 },
  stepsChart: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 100, marginBottom: 8 },
  barWrapper: { alignItems: "center", gap: 4, flex: 1 },
  bar: { width: 28, borderRadius: 6, minHeight: 4 },
  barDay: { fontFamily: "Inter_500Medium", fontSize: 10, color: Colors.textDim },
  barSteps: { fontFamily: "Inter_400Regular", fontSize: 9, color: Colors.textDim },
  stepsGoal: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, textAlign: "center" },
  tipsCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 8 },
  tipsHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  tipsTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.accent },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent, marginTop: 5 },
  tipText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
});
