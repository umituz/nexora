import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const FEATURE_GRID = [
  { label: "Focus", icon: "timer-outline", color: "#EF4444", route: "/focus" },
  { label: "Habits", icon: "checkmark-circle-outline", color: "#10B981", route: "/habits" },
  { label: "Goals", icon: "flag-outline", color: "#F59E0B", route: "/goals" },
  { label: "Notes", icon: "document-text-outline", color: "#8B5CF6", route: "/notes-list" },
  { label: "Email", icon: "mail-outline", color: "#4F8EF7", route: "/email-inbox" },
  { label: "Health", icon: "heart-outline", color: "#EF4444", route: "/health" },
  { label: "Budget", icon: "pie-chart-outline", color: "#10B981", route: "/budget" },
  { label: "Weather", icon: "partly-sunny-outline", color: "#F59E0B", route: "/weather" },
  { label: "Contacts", icon: "people-outline", color: "#06B6D4", route: "/contacts" },
  { label: "News", icon: "newspaper-outline", color: "#8B5CF6", route: "/news" },
  { label: "Shopping", icon: "cart-outline", color: "#10B981", route: "/shopping" },
  { label: "Journal", icon: "journal-outline", color: "#F59E0B", route: "/journal" },
  { label: "Travel", icon: "airplane-outline", color: "#4F8EF7", route: "/travel" },
  { label: "Documents", icon: "folder-outline", color: "#8B5CF6", route: "/documents" },
  { label: "Team", icon: "people-circle-outline", color: "#06B6D4", route: "/team" },
  { label: "Workflows", icon: "git-network-outline", color: "#EF4444", route: "/workflows" },
  { label: "Analytics", icon: "bar-chart-outline", color: "#4F8EF7", route: "/analytics" },
  { label: "Alerts", icon: "notifications-outline", color: "#F59E0B", route: "/notifications" },
];

function FeatureCard({ item, index }: { item: typeof FEATURE_GRID[0]; index: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View entering={FadeInDown.delay(index * 30).springify()} style={[animStyle, styles.featureCard]}>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(item.route as any); }}
        onPressIn={() => { scale.value = withSpring(0.93); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.featureCardInner}
      >
        <View style={[styles.featureIcon, { backgroundColor: item.color + "20" }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <Text style={styles.featureLabel}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function TaskRow({ task, onToggle }: { task: any; onToggle: () => void }) {
  const priorityColor = task.priority === "high" ? Colors.danger : task.priority === "medium" ? Colors.warning : Colors.textDim;
  return (
    <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onToggle(); }} style={styles.taskRow}>
      <View style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
        {task.done && <Ionicons name="checkmark" size={11} color="#fff" />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, task.done && styles.taskDone]}>{task.title}</Text>
        <Text style={[styles.taskMeta, { color: priorityColor }]}>{task.dueDate} · {task.priority}</Text>
      </View>
    </Pressable>
  );
}

function WorkflowStep({ step, index }: { step: any; index: number }) {
  const statusColor = step.status === "done" ? Colors.success : step.status === "running" ? Colors.accent : Colors.textDim;
  const icon = step.status === "done" ? "checkmark-circle" : step.status === "running" ? "ellipsis-horizontal-circle" : "radio-button-off";
  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()} style={styles.wfRow}>
      <Ionicons name={icon as any} size={14} color={statusColor} />
      <View style={{ flex: 1 }}>
        <Text style={styles.wfLabel}>{step.label}</Text>
        {step.detail ? <Text style={styles.wfDetail}>{step.detail}</Text> : null}
      </View>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, toggleTask, conversations, totalMonthlySpend, completedTasksCount, pendingTasksCount, unreadEmailCount, unreadNotificationCount, habits } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const productivityScore = Math.round((completedTasksCount / Math.max(tasks.length, 1)) * 100);
  const highPriorityCount = tasks.filter((t) => t.priority === "high" && !t.done).length;
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const habitsDoneToday = habits.filter((h) => h.completedToday).length;

  const lastWorkflow = useMemo(() => {
    for (const conv of conversations) for (const msg of conv.messages) if (msg.workflow) return msg.workflow;
    return null;
  }, [conversations]);

  const highPriority = tasks.filter((t) => t.priority === "high" && !t.done).slice(0, 3);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{todayLabel}</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <Pressable onPress={() => router.push("/notifications" as any)} style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={20} color={Colors.text} />
          {unreadNotificationCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadNotificationCount}</Text></View>}
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.briefingCard}>
          <View style={styles.briefRow}>
            <Ionicons name="sparkles" size={14} color={Colors.accent} />
            <Text style={styles.briefTitle}>AI Morning Briefing</Text>
          </View>
          <Text style={styles.briefText}>
            You have <Text style={{ color: Colors.accent, fontFamily: "Inter_600SemiBold" }}>{pendingTasksCount} tasks</Text> pending, <Text style={{ color: Colors.danger, fontFamily: "Inter_600SemiBold" }}>{highPriorityCount} high priority</Text>. {unreadEmailCount} unread emails. Subscription spend: <Text style={{ color: Colors.warning, fontFamily: "Inter_600SemiBold" }}>${totalMonthlySpend.toFixed(2)}/mo</Text>.
          </Text>
        </Animated.View>

        <View style={styles.statsRow}>
          {[
            { label: "Done", value: completedTasksCount, icon: "checkmark-done-outline", color: Colors.success },
            { label: "Pending", value: pendingTasksCount, icon: "time-outline", color: Colors.warning },
            { label: "Habits", value: `${habitsDoneToday}/${habits.length}`, icon: "checkmark-circle-outline", color: Colors.accentViolet },
            { label: "Emails", value: unreadEmailCount, icon: "mail-outline", color: Colors.accent },
          ].map((s, i) => (
            <Animated.View key={s.label} entering={FadeInDown.delay(60 + i * 40).springify()} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}><Ionicons name={s.icon as any} size={14} color={s.color} /></View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(180).springify()} style={styles.progressCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Productivity</Text>
            <Text style={styles.progressSub}>{completedTasksCount} of {tasks.length} tasks complete</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${productivityScore}%` as any, backgroundColor: productivityScore > 70 ? Colors.success : productivityScore > 40 ? Colors.warning : Colors.danger }]} />
            </View>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{productivityScore}%</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Features</Text>
          </View>
          <View style={styles.featureGrid}>
            {FEATURE_GRID.map((item, i) => <FeatureCard key={item.label} item={item} index={i} />)}
          </View>
        </Animated.View>

        {highPriority.length > 0 && (
          <Animated.View entering={FadeInDown.delay(280).springify()} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Priority Tasks</Text>
              <Pressable onPress={() => router.push("/tasks" as any)}><Text style={styles.seeAll}>See all</Text></Pressable>
            </View>
            {highPriority.map((t) => <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t.id)} />)}
          </Animated.View>
        )}

        {lastWorkflow && (
          <Animated.View entering={FadeInDown.delay(340).springify()} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="git-network-outline" size={13} color={Colors.accentCyan} />
                <Text style={styles.sectionTitle}>Last Workflow</Text>
              </View>
              <Pressable onPress={() => router.push("/workflows" as any)}><Text style={styles.seeAll}>All</Text></Pressable>
            </View>
            {lastWorkflow.map((s, i) => <WorkflowStep key={s.id} step={s} index={i} />)}
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14 },
  greeting: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text, letterSpacing: -0.5 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  badge: { position: "absolute", top: -2, right: -2, backgroundColor: Colors.danger, borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  badgeText: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#fff" },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  briefingCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  briefRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  briefTitle: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.accent },
  briefText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: Colors.border, gap: 3 },
  statIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary },
  progressCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 14 },
  progressSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 2, marginBottom: 10 },
  progressBar: { height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 5, borderRadius: 3 },
  scoreCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.bgElevated, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: Colors.accent },
  scoreText: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.text },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  seeAll: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.accent },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  featureCard: { width: "22%", aspectRatio: 1 },
  featureCardInner: { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: 14, alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1, borderColor: Colors.border },
  featureIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  featureLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: Colors.textSecondary, textAlign: "center" },
  section: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  taskRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Colors.border },
  taskCheck: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  taskCheckDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  taskTitle: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
  taskDone: { color: Colors.textDim, textDecorationLine: "line-through" },
  taskMeta: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 1 },
  wfRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.border },
  wfLabel: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.text },
  wfDetail: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
});
