import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const MOOD_MAP: Record<number, { icon: string; color: string; label: string }> = {
  1: { icon: "thunderstorm-outline", color: "#8B5CF6", label: "awful" },
  2: { icon: "sad-outline", color: "#EF4444", label: "bad" },
  3: { icon: "remove-outline", color: "#F59E0B", label: "okay" },
  4: { icon: "smile-outline", color: "#4F8EF7", label: "good" },
  5: { icon: "happy-outline", color: "#10B981", label: "great" },
};

const MOOD_FILTERS = [0, 5, 4, 3, 2, 1];
const MOOD_FILTER_LABELS: Record<number, string> = { 0: "All", 1: "Awful", 2: "Bad", 3: "Okay", 4: "Good", 5: "Great" };

function EntryCard({ entry, index }: { entry: any; index: number }) {
  const mood = MOOD_MAP[entry.mood] || { icon: "ellipse-outline", color: Colors.textSecondary, label: "okay" };
  const dateParts = entry.date.split(" ");
  const month = dateParts[0] || "";
  const day = dateParts[1]?.replace(",", "") || "";

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.entryCard}>
        <View style={styles.entryDateBlock}>
          <Text style={styles.entryDay}>{day}</Text>
          <Text style={styles.entryMonth}>{month}</Text>
        </View>
        <View style={styles.entryContent}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryTitle} numberOfLines={1}>{entry.aiPromptUsed || "Journal Entry"}</Text>
            <View style={[styles.moodBadge, { backgroundColor: mood.color + "20" }]}>
              <Ionicons name={mood.icon as any} size={14} color={mood.color} />
            </View>
          </View>
          <Text style={styles.entryPreview} numberOfLines={2}>{entry.content}</Text>
          {entry.tags?.length > 0 && (
            <View style={styles.tagRow}>
              {entry.tags.slice(0, 3).map((t: string) => (
                <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
              ))}
            </View>
          )}
          <Text style={styles.wordCount}>{entry.wordCount} words</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { journalEntries } = useApp();
  const [moodFilter, setMoodFilter] = useState(0);

  const filtered = moodFilter === 0 ? journalEntries : journalEntries.filter((e) => e.mood === moodFilter);

  const positiveCount = journalEntries.filter((e) => e.mood >= 4).length;
  const avgMood = Math.round(journalEntries.reduce((s, e) => s + e.mood, 0) / Math.max(journalEntries.length, 1));

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Journal</Text>
        <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{journalEntries.length}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.success }]}>{positiveCount}</Text>
                <Text style={styles.summaryLabel}>Positive</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Ionicons name={MOOD_MAP[avgMood]?.icon as any || "smile-outline"} size={20} color={MOOD_MAP[avgMood]?.color || Colors.accent} />
                <Text style={styles.summaryLabel}>Avg mood</Text>
              </View>
            </Animated.View>
            <View style={styles.moodRow}>
              {MOOD_FILTERS.map((m) => {
                const moodInfo = m > 0 ? MOOD_MAP[m] : null;
                const isActive = moodFilter === m;
                return (
                  <Pressable key={m} onPress={() => { Haptics.selectionAsync(); setMoodFilter(m); }} style={[styles.moodBtn, isActive && { backgroundColor: moodInfo?.color || Colors.accent, borderColor: moodInfo?.color || Colors.accent }]}>
                    {moodInfo ? <Ionicons name={moodInfo.icon as any} size={13} color={isActive ? "#fff" : moodInfo.color} /> : null}
                    <Text style={[styles.moodBtnText, isActive && { color: "#fff" }]}>{MOOD_FILTER_LABELS[m]}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item, index }) => <EntryCard entry={item} index={index} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="journal-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyText}>No entries</Text>
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
  summaryCard: { flexDirection: "row", backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  summaryItem: { flex: 1, alignItems: "center", gap: 2 },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  moodRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 16 },
  moodBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  moodBtnText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textSecondary },
  entryCard: { flexDirection: "row", backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 10, gap: 12 },
  entryDateBlock: { width: 36, alignItems: "center", paddingTop: 2 },
  entryDay: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  entryMonth: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary, textTransform: "uppercase" },
  entryContent: { flex: 1, gap: 5 },
  entryHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  entryTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.accent, flex: 1 },
  moodBadge: { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  entryPreview: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  tagRow: { flexDirection: "row", gap: 5 },
  tag: { backgroundColor: Colors.bgElevated, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 },
  tagText: { fontFamily: "Inter_500Medium", fontSize: 10, color: Colors.textSecondary },
  wordCount: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textDim },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.textSecondary },
});
