import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring, withTiming, withRepeat, Easing } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";

const MODES = [
  { label: "Focus", minutes: 25, color: "#EF4444" },
  { label: "Short Break", minutes: 5, color: "#10B981" },
  { label: "Long Break", minutes: 15, color: "#4F8EF7" },
];

const SESSIONS = [
  { id: "s1", label: "Q1 Report Review", duration: 25, completedAt: "Today, 8:15 AM" },
  { id: "s2", label: "Email triage", duration: 25, completedAt: "Today, 9:05 AM" },
  { id: "s3", label: "Design review", duration: 25, completedAt: "Yesterday" },
  { id: "s4", label: "Deep work block", duration: 50, completedAt: "Yesterday" },
];

function pad(n: number) { return n.toString().padStart(2, "0"); }

export default function FocusScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [modeIndex, setModeIndex] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseScale = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }] }));

  const mode = MODES[modeIndex];
  const total = mode.minutes * 60;
  const progress = (total - seconds) / total;

  useEffect(() => {
    setSeconds(MODES[modeIndex].minutes * 60);
    setRunning(false);
  }, [modeIndex]);

  useEffect(() => {
    if (running) {
      pulseScale.value = withRepeat(withTiming(1.04, { duration: 1000, easing: Easing.inOut(Easing.sin) }), -1, true);
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setRunning(false);
            setSessionsToday((n) => n + 1);
            return MODES[modeIndex].minutes * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      pulseScale.value = withSpring(1);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRunning((r) => !r);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRunning(false);
    setSeconds(mode.minutes * 60);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Focus</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.modeRow}>
          {MODES.map((m, i) => (
            <Pressable key={m.label} onPress={() => { Haptics.selectionAsync(); setModeIndex(i); }} style={[styles.modeBtn, modeIndex === i && { backgroundColor: m.color, borderColor: m.color }]}>
              <Text style={[styles.modeBtnText, modeIndex === i && { color: "#fff" }]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        <Animated.View style={[styles.timerContainer, pulseStyle]}>
          <View style={[styles.timerRing, { borderColor: mode.color }]}>
            <View style={[styles.timerInner, { backgroundColor: mode.color + "15" }]}>
              <Text style={[styles.timerText, { color: mode.color }]}>{pad(mins)}:{pad(secs)}</Text>
              <Text style={styles.timerMode}>{mode.label}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.controls}>
          <Pressable onPress={handleReset} style={styles.secondaryBtn}>
            <Ionicons name="refresh-outline" size={22} color={Colors.textSecondary} />
          </Pressable>
          <Pressable onPress={handleToggle} style={[styles.mainBtn, { backgroundColor: mode.color }]}>
            <Ionicons name={running ? "pause" : "play"} size={30} color="#fff" />
          </Pressable>
          <Pressable onPress={() => Alert.alert("Focus Settings", "Custom durations coming soon.")} style={styles.secondaryBtn}>
            <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: mode.color }]}>{sessionsToday}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: mode.color }]}>{sessionsToday}</Text>
            <Text style={styles.statLabel}>This week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: mode.color }]}>{sessionsToday * MODES[0].minutes}m</Text>
            <Text style={styles.statLabel}>Focus time</Text>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {SESSIONS.map((s) => (
            <View key={s.id} style={styles.sessionRow}>
              <View style={[styles.sessionDot, { backgroundColor: mode.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionLabel}>{s.label}</Text>
                <Text style={styles.sessionTime}>{s.completedAt}</Text>
              </View>
              <Text style={[styles.sessionDur, { color: mode.color }]}>{s.duration}m</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  content: { paddingHorizontal: 20, paddingBottom: 100, alignItems: "center" },
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 36, alignSelf: "stretch", justifyContent: "center" },
  modeBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  modeBtnText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  timerContainer: { marginBottom: 36 },
  timerRing: { width: 220, height: 220, borderRadius: 110, borderWidth: 5, alignItems: "center", justifyContent: "center" },
  timerInner: { width: 190, height: 190, borderRadius: 95, alignItems: "center", justifyContent: "center", gap: 4 },
  timerText: { fontFamily: "Inter_700Bold", fontSize: 52, letterSpacing: -2 },
  timerMode: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.textSecondary },
  controls: { flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 32 },
  mainBtn: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  secondaryBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 28, alignSelf: "stretch", justifyContent: "center" },
  statCard: { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: Colors.border, gap: 4 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary },
  section: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, alignSelf: "stretch" },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text, marginBottom: 10 },
  sessionRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  sessionDot: { width: 8, height: 8, borderRadius: 4 },
  sessionLabel: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.text },
  sessionTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  sessionDur: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
});
