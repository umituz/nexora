import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const DESTINATION_ICONS: Record<string, string> = {
  Barcelona: "sunny-outline",
  Tokyo: "railway-outline",
  "New York": "business-outline",
};

function TripCard({ trip, index }: { trip: any; index: number }) {
  const statusColor = trip.status === "planning" ? Colors.accent : trip.status === "booked" ? Colors.success : Colors.textDim;
  const statusLabel = trip.status === "planning" ? "Planning" : trip.status === "booked" ? "Booked" : "Completed";
  const checkedItems = trip.items?.filter((i: any) => i.done).length || 0;
  const totalItems = trip.items?.length || 0;
  const icon = DESTINATION_ICONS[trip.destination] || "airplane-outline";

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()} style={[styles.tripCard, trip.status === "booked" && styles.tripCardActive]}>
      {trip.status === "booked" && <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>BOOKED</Text></View>}
      <View style={styles.tripHeader}>
        <View style={[styles.tripIcon, { backgroundColor: trip.color + "20" }]}>
          <Ionicons name={icon as any} size={22} color={trip.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.tripName}>{trip.destination}</Text>
          <Text style={styles.tripDates}>{trip.startDate} — {trip.endDate} · {trip.country}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.tripBudget}>
        <View style={styles.budgetItem}>
          <Ionicons name="card-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.budgetText}>Budget: ${trip.budget.toLocaleString()}</Text>
        </View>
        <View style={styles.budgetItem}>
          <Ionicons name="trending-up-outline" size={13} color={trip.spent > 0 ? Colors.warning : Colors.textDim} />
          <Text style={styles.budgetText}>Spent: ${trip.spent.toLocaleString()}</Text>
        </View>
      </View>

      {totalItems > 0 && (
        <View style={styles.checklistRow}>
          <Text style={styles.checklistLabel}>Checklist: {checkedItems}/{totalItems}</Text>
          <View style={styles.checklistBar}>
            <View style={[styles.checklistFill, { width: `${(checkedItems / totalItems) * 100}%` as any, backgroundColor: trip.color }]} />
          </View>
        </View>
      )}

      <View style={styles.itemsList}>
        {trip.items?.slice(0, 3).map((item: any) => (
          <View key={item.id} style={styles.checkItem}>
            <Ionicons name={item.done ? "checkmark-circle" : "ellipse-outline"} size={14} color={item.done ? Colors.success : Colors.textDim} />
            <Text style={[styles.checkItemText, item.done && { color: Colors.textDim, textDecorationLine: "line-through" }]}>{item.label}</Text>
          </View>
        ))}
        {totalItems > 3 && <Text style={styles.moreItems}>+{totalItems - 3} more items</Text>}
      </View>
    </Animated.View>
  );
}

export default function TravelScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { travelPlans } = useApp();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const upcoming = travelPlans.filter((t) => t.status !== "completed");
  const past = travelPlans.filter((t) => t.status === "completed");
  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Travel</Text>
        <Pressable onPress={() => Alert.alert("Plan Trip", "Trip planning coming soon.")} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.statsRow}>
          {[
            { label: "Trips", value: travelPlans.length, icon: "airplane-outline", color: Colors.accent },
            { label: "Countries", value: new Set(travelPlans.map((t) => t.country)).size, icon: "globe-outline", color: Colors.accentViolet },
            { label: "Upcoming", value: upcoming.length, icon: "calendar-outline", color: Colors.success },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}>
                <Ionicons name={s.icon as any} size={16} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.tabRow}>
          <Pressable onPress={() => setTab("upcoming")} style={[styles.tabBtn, tab === "upcoming" && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === "upcoming" && styles.tabTextActive]}>Upcoming ({upcoming.length})</Text>
          </Pressable>
          <Pressable onPress={() => setTab("past")} style={[styles.tabBtn, tab === "past" && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === "past" && styles.tabTextActive]}>Past ({past.length})</Text>
          </Pressable>
        </View>

        {shown.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} />)}
        {shown.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="airplane-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyText}>No {tab} trips</Text>
          </View>
        )}
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
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: Colors.border, gap: 4 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 12, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  tabBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  tabTextActive: { color: "#fff" },
  tripCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, gap: 10 },
  tripCardActive: { borderColor: Colors.success + "50" },
  activeBadge: { position: "absolute", top: 12, right: 12, backgroundColor: Colors.success, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  activeBadgeText: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#fff", letterSpacing: 0.5 },
  tripHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  tripIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  tripName: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.text },
  tripDates: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  tripBudget: { flexDirection: "row", gap: 16 },
  budgetItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  budgetText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  checklistRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checklistLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, minWidth: 100 },
  checklistBar: { flex: 1, height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: "hidden" },
  checklistFill: { height: 4, borderRadius: 2 },
  itemsList: { gap: 4 },
  checkItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  checkItemText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.text },
  moreItems: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textDim, marginTop: 2 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.textSecondary },
});
