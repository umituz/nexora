import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const STATUS_STYLE: Record<string, { color: string; icon: string }> = {
  done: { color: Colors.success, icon: "checkmark-circle" },
  running: { color: Colors.accent, icon: "ellipsis-horizontal-circle" },
  pending: { color: Colors.textDim, icon: "radio-button-off" },
  failed: { color: Colors.danger, icon: "close-circle" },
};

function WorkflowCard({ wf, index }: { wf: any; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const statusStyle = STATUS_STYLE[wf.status] || STATUS_STYLE.pending;

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()} style={styles.wfCard}>
      <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setExpanded(!expanded); }} style={styles.wfHeader}>
        <View style={[styles.wfIcon, { backgroundColor: wf.color + "20" }]}>
          <Ionicons name={wf.icon as any} size={18} color={wf.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.wfName}>{wf.name}</Text>
          <Text style={styles.wfTime}>{wf.triggeredAt}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.color + "20" }]}>
          <Ionicons name={statusStyle.icon as any} size={13} color={statusStyle.color} />
          <Text style={[styles.statusText, { color: statusStyle.color }]}>{wf.status}</Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={Colors.textDim} />
      </Pressable>

      {expanded && wf.steps.map((step: any, i: number) => {
        const ss = STATUS_STYLE[step.status] || STATUS_STYLE.pending;
        return (
          <Animated.View key={step.id} entering={FadeInRight.delay(i * 50).springify()} style={styles.stepRow}>
            <View style={styles.stepLine}>
              <View style={[styles.stepDot, { backgroundColor: ss.color }]} />
              {i < wf.steps.length - 1 && <View style={[styles.stepConnector, { backgroundColor: i < wf.steps.findIndex((s: any) => s.status !== "done") ? ss.color : Colors.border }]} />}
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Ionicons name={ss.icon as any} size={13} color={ss.color} />
              </View>
              {step.detail && <Text style={styles.stepDetail}>{step.detail}</Text>}
              {step.duration && <Text style={styles.stepDuration}>{step.duration}</Text>}
            </View>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

export default function WorkflowsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { workflowRuns } = useApp();
  const runningCount = workflowRuns.filter((w) => w.status === "running").length;
  const doneCount = workflowRuns.filter((w) => w.status === "done").length;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Workflows</Text>
        <Pressable onPress={() => Alert.alert("New Workflow", "Workflow builder coming soon.")} style={styles.newBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.statsRow}>
          {[
            { label: "Total", value: workflowRuns.length, color: Colors.accent },
            { label: "Running", value: runningCount, color: Colors.warning },
            { label: "Completed", value: doneCount, color: Colors.success },
            { label: "Failed", value: workflowRuns.filter((w) => w.status === "failed").length, color: Colors.danger },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {workflowRuns.map((wf, i) => <WorkflowCard key={wf.id} wf={wf} index={i} />)}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  newBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: 12, padding: 12, alignItems: "center", borderWidth: 1, borderColor: Colors.border, gap: 3 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 20 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary },
  wfCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 12, gap: 0 },
  wfHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 0 },
  wfIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  wfName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  wfTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  stepRow: { flexDirection: "row", marginTop: 10, gap: 0 },
  stepLine: { width: 32, alignItems: "center", paddingTop: 3 },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
  stepConnector: { width: 1.5, flex: 1, marginTop: 4 },
  stepContent: { flex: 1, paddingBottom: 4 },
  stepHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepLabel: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.text },
  stepDetail: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  stepDuration: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textDim, marginTop: 1 },
});
