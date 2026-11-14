import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const FILTERS = ["All", "Today", "High", "Done"];
const PRIORITY_COLORS: Record<string, string> = { high: Colors.danger, medium: Colors.warning, low: Colors.success };

function TaskRow({ task, onToggle, index }: { task: any; onToggle: () => void; index: number }) {
  const pColor = PRIORITY_COLORS[task.priority] || Colors.textSecondary;
  return (
    <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
      <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onToggle(); }} style={styles.taskRow}>
        <View style={[styles.check, task.done && styles.checkDone]}>
          {task.done && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]} numberOfLines={1}>{task.title}</Text>
          <View style={styles.taskMeta}>
            {task.dueDate && <View style={styles.metaChip}><Ionicons name="calendar-outline" size={10} color={Colors.textDim} /><Text style={styles.metaText}>{task.dueDate}</Text></View>}
            {task.project && <View style={styles.metaChip}><Ionicons name="briefcase-outline" size={10} color={Colors.textDim} /><Text style={styles.metaText}>{task.project}</Text></View>}
          </View>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: pColor + "20" }]}>
          <Text style={[styles.priorityText, { color: pColor }]}>{task.priority}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { tasks, toggleTask, addTask, completedTasksCount, pendingTasksCount } = useApp();
  const [filter, setFilter] = useState("All");

  const filtered = tasks.filter((t) => {
    if (filter === "Today") return t.dueDate === "Today";
    if (filter === "High") return t.priority === "high";
    if (filter === "Done") return t.done;
    return true;
  });

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addTask({ title: "New task", done: false, priority: "medium" });
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Tasks</Text>
        <Pressable onPress={handleAdd} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.success }]}>{completedTasksCount}</Text>
                <Text style={styles.summaryLabel}>Done</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.warning }]}>{pendingTasksCount}</Text>
                <Text style={styles.summaryLabel}>Pending</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.danger }]}>{tasks.filter((t) => t.priority === "high" && !t.done).length}</Text>
                <Text style={styles.summaryLabel}>High priority</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{Math.round((completedTasksCount / Math.max(tasks.length, 1)) * 100)}%</Text>
                <Text style={styles.summaryLabel}>Completion</Text>
              </View>
            </Animated.View>
            <View style={styles.filterRow}>
              {FILTERS.map((f) => (
                <Pressable key={f} onPress={() => { Haptics.selectionAsync(); setFilter(f); }} style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
                  <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <TaskRow task={item} onToggle={() => toggleTask(item.id)} index={index} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-done-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyText}>No tasks</Text>
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
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  summaryCard: { flexDirection: "row", backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  filterBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  filterBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  filterTextActive: { color: "#fff" },
  taskRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  check: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  checkDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  taskTitle: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
  taskTitleDone: { color: Colors.textDim, textDecorationLine: "line-through" },
  taskMeta: { flexDirection: "row", gap: 8, marginTop: 3 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textDim },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.textSecondary },
});
