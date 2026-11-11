import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function HabitCard({ habit, onToggle, index }: { habit: any; onToggle: () => void; index: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const last7 = getLast7Days();
  const completedSet = new Set<string>(habit.completedDates);

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()} style={animStyle}>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onToggle(); scale.value = withSpring(0.96, {}, () => { scale.value = withSpring(1); }); }}
        style={[styles.habitCard, habit.completedToday && { borderColor: habit.color + "50" }]}
      >
        <View style={[styles.habitIcon, { backgroundColor: habit.color + "20" }]}>
          <Ionicons name={habit.icon as any} size={22} color={habit.color} />
        </View>
        <View style={styles.habitInfo}>
          <View style={styles.habitNameRow}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <View style={[styles.streakBadge, { backgroundColor: habit.color + "20" }]}>
              <Ionicons name="flame-outline" size={11} color={habit.color} />
              <Text style={[styles.streakText, { color: habit.color }]}>{habit.streak}</Text>
            </View>
          </View>
          <View style={styles.dayRow}>
            {last7.map((dateStr, i) => {
              const done = completedSet.has(dateStr);
              return (
                <View key={i} style={[styles.dayDot, done && { backgroundColor: habit.color }]}>
                  <Text style={[styles.dayDotText, done && { color: "#fff" }]}>{DAYS[i]}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={[styles.checkCircle, habit.completedToday && { backgroundColor: habit.color, borderColor: habit.color }]}>
          {habit.completedToday && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { habits, toggleHabit } = useApp();
  const doneToday = habits.filter((h) => h.completedToday).length;
  const longestStreak = Math.max(0, ...habits.map((h) => h.streak));

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Habits</Text>
        <Pressable onPress={() => Alert.alert("Add Habit", "Habit creation coming soon.")} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>{doneToday}</Text>
            <Text style={styles.summaryLabel}>Done today</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{habits.length}</Text>
            <Text style={styles.summaryLabel}>Total habits</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.warning }]}>{longestStreak}</Text>
            <Text style={styles.summaryLabel}>Best streak</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.accent }]}>{Math.round((doneToday / habits.length) * 100)}%</Text>
            <Text style={styles.summaryLabel}>Completion</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarInner, { width: `${(doneToday / habits.length) * 100}%` as any }]} />
          </View>
          <Text style={styles.progressText}>{doneToday} of {habits.length} habits completed</Text>
        </Animated.View>

        <Text style={styles.sectionLabel}>Daily Habits</Text>
        {habits.filter((h) => h.frequency === "daily").map((habit, i) => (
          <HabitCard key={habit.id} habit={habit} onToggle={() => toggleHabit(habit.id)} index={i} />
        ))}

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Weekly Habits</Text>
        {habits.filter((h) => h.frequency === "weekly").map((habit, i) => (
          <HabitCard key={habit.id} habit={habit} onToggle={() => toggleHabit(habit.id)} index={i + 10} />
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
  summaryCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, flexDirection: "row", borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  progressCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 20, gap: 8 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  progressBarOuter: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  progressBarInner: { height: 6, backgroundColor: Colors.success, borderRadius: 3 },
  progressText: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.textDim, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 },
  habitCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  habitIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  habitInfo: { flex: 1, gap: 6 },
  habitNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  habitName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  streakBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  streakText: { fontFamily: "Inter_700Bold", fontSize: 12 },
  dayRow: { flexDirection: "row", gap: 4 },
  dayDot: { width: 20, height: 20, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: Colors.border },
  dayDotText: { fontFamily: "Inter_600SemiBold", fontSize: 9, color: Colors.textDim },
  checkCircle: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
});
