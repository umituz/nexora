import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function GoalCard({ goal, onMilestoneToggle, index }: { goal: any; onMilestoneToggle: (mId: string) => void; index: number }) {
  const doneMilestones = goal.milestones.filter((m: any) => m.done).length;
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify()} style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={[styles.goalIcon, { backgroundColor: goal.color + "20" }]}>
          <Ionicons name={goal.icon as any} size={20} color={goal.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <View style={styles.goalMeta}>
            <Ionicons name="flag-outline" size={11} color={Colors.textSecondary} />
            <Text style={styles.goalMetaText}>{goal.category}</Text>
            <Ionicons name="calendar-outline" size={11} color={Colors.textSecondary} />
            <Text style={styles.goalMetaText}>{goal.targetDate}</Text>
          </View>
        </View>
        <View style={[styles.goalPct, { backgroundColor: goal.color + "20" }]}>
          <Text style={[styles.goalPctText, { color: goal.color }]}>{goal.progress}%</Text>
        </View>
      </View>
      <View style={styles.goalBar}>
        <View style={[styles.goalBarFill, { width: `${goal.progress}%` as any, backgroundColor: goal.color }]} />
      </View>
      <Text style={styles.milestonesLabel}>Milestones · {doneMilestones}/{goal.milestones.length}</Text>
      {goal.milestones.map((m: any) => (
        <Pressable key={m.id} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onMilestoneToggle(m.id); }} style={styles.milestoneRow}>
          <View style={[styles.milestoneCheck, m.done && { backgroundColor: goal.color, borderColor: goal.color }]}>
            {m.done && <Ionicons name="checkmark" size={10} color="#fff" />}
          </View>
          <Text style={[styles.milestoneText, m.done && { color: Colors.textDim, textDecorationLine: "line-through" }]}>{m.label}</Text>
        </Pressable>
      ))}
    </Animated.View>
  );
}

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { goals, toggleGoalMilestone } = useApp();
  const avgProgress = goals.length === 0 ? 0 : Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Goals</Text>
        <Pressable onPress={() => Alert.alert("Add Goal", "Goal creation coming soon.")} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.overviewCard}>
          <View style={styles.overviewLeft}>
            <Text style={styles.overviewTitle}>Overall Progress</Text>
            <Text style={styles.overviewSub}>{goals.length} active goals · {goals.filter((g) => g.progress === 100).length} completed</Text>
            <View style={styles.overviewBar}>
              <View style={[styles.overviewBarFill, { width: `${avgProgress}%` as any }]} />
            </View>
          </View>
          <View style={styles.overviewCircle}>
            <Text style={styles.overviewPct}>{avgProgress}%</Text>
          </View>
        </Animated.View>

        {goals.map((goal, i) => (
          <GoalCard key={goal.id} goal={goal} onMilestoneToggle={(mId) => toggleGoalMilestone(goal.id, mId)} index={i} />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  overviewCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: Colors.border, flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  overviewLeft: { flex: 1, gap: 6 },
  overviewTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text },
  overviewSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  overviewBar: { height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  overviewBarFill: { height: 5, backgroundColor: Colors.accent, borderRadius: 3 },
  overviewCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.bgElevated, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: Colors.accent },
  overviewPct: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  goalCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, gap: 10 },
  goalHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  goalIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  goalTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  goalMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  goalMetaText: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary },
  goalPct: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  goalPctText: { fontFamily: "Inter_700Bold", fontSize: 14 },
  goalBar: { height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  goalBarFill: { height: 5, borderRadius: 3 },
  milestonesLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textSecondary },
  milestoneRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  milestoneCheck: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  milestoneText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.text, flex: 1 },
});
