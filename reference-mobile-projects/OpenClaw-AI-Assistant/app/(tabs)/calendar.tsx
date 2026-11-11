import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function CalendarDay({ day, isToday, hasEvent, isSelected, onPress }: any) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={() => { Haptics.selectionAsync(); onPress(); scale.value = withSpring(0.92, {}, () => { scale.value = withSpring(1); }); }}
        style={[
          styles.calDay,
          isToday && styles.calDayToday,
          isSelected && !isToday && styles.calDaySelected,
        ]}
      >
        <Text style={[styles.calDayNum, isToday && styles.calDayNumToday, isSelected && !isToday && styles.calDayNumSelected]}>
          {day}
        </Text>
        {hasEvent && <View style={[styles.calDot, { backgroundColor: isToday ? "#fff" : Colors.accent }]} />}
      </Pressable>
    </Animated.View>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const typeIcon = event.type === "meeting" ? "people-outline" : event.type === "reminder" ? "alarm-outline" : event.type === "task" ? "checkmark-circle-outline" : "calendar-outline";

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()} style={animStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.eventCard}
      >
        <View style={[styles.eventBar, { backgroundColor: event.color }]} />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.eventMeta}>
            <Ionicons name={typeIcon as any} size={12} color={Colors.textSecondary} />
            <Text style={styles.eventTime}>{event.time}</Text>
            {event.description ? <Text style={styles.eventDesc} numberOfLines={1}>{event.description}</Text> : null}
          </View>
        </View>
        <View style={[styles.eventTypeBadge, { backgroundColor: event.color + "20" }]}>
          <Text style={[styles.eventTypeText, { color: event.color }]}>{event.type}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { events, addEvent } = useApp();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const year = currentYear;
  const month = currentMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
    setSelectedDate(1);
  };

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  const eventsForSelectedDate = useMemo(() => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  }, [events, selectedDate, year, month]);

  const datesWithEvents = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
    return new Set(
      events
        .filter((e) => e.date.startsWith(prefix))
        .map((e) => parseInt(e.date.split("-")[2]))
    );
  }, [events, year, month]);

  const handleAddEvent = () => {
    if (!newTitle.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addEvent({
      title: newTitle,
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
      time: "12:00 PM",
      color: Colors.accent,
      type: "event",
    });
    setNewTitle("");
    setShowAdd(false);
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <Pressable onPress={() => setShowAdd(!showAdd)} style={styles.addBtn}>
          <Ionicons name={showAdd ? "close" : "add"} size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.calCard}>
          <View style={styles.calHeader}>
            <Pressable onPress={handlePrevMonth} hitSlop={12}>
              <Ionicons name="chevron-back" size={18} color={Colors.textSecondary} />
            </Pressable>
            <Text style={styles.calMonthTitle}>{MONTHS[month]} {year}</Text>
            <Pressable onPress={handleNextMonth} hitSlop={12}>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
            </Pressable>
          </View>
          <View style={styles.calDayLabels}>
            {DAYS.map((d) => <Text key={d} style={styles.calDayLabel}>{d}</Text>)}
          </View>
          <View style={styles.calGrid}>
            {calendarDays.map((day, i) =>
              day === null ? (
                <View key={`null-${i}`} style={styles.calDay} />
              ) : (
                <CalendarDay
                  key={day}
                  day={day}
                  isToday={day === today.getDate() && month === today.getMonth() && year === today.getFullYear()}
                  hasEvent={datesWithEvents.has(day)}
                  isSelected={day === selectedDate}
                  onPress={() => setSelectedDate(day)}
                />
              )
            )}
          </View>
        </Animated.View>

        {showAdd && (
          <Animated.View entering={FadeInDown.springify()} style={styles.addCard}>
            <Text style={styles.addTitle}>Add Event — {MONTHS[month]} {selectedDate}</Text>
            <TextInput
              style={styles.addInput}
              placeholder="Event title..."
              placeholderTextColor={Colors.textDim}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
            <Pressable onPress={handleAddEvent} style={styles.addConfirm}>
              <Text style={styles.addConfirmText}>Add Event</Text>
            </Pressable>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(120).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedDate === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              ? "Today"
              : `${MONTHS[month]} ${selectedDate}`}
            </Text>
            <Text style={styles.sectionCount}>{eventsForSelectedDate.length} events</Text>
          </View>

          {eventsForSelectedDate.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={36} color={Colors.textDim} />
              <Text style={styles.emptyText}>No events this day</Text>
              <Text style={styles.emptySub}>Tap + to add one</Text>
            </View>
          ) : (
            eventsForSelectedDate.map((e, i) => <EventCard key={e.id} event={e} index={i} />)
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text, letterSpacing: -0.5 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgSurface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  calCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  calHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  calMonthTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text },
  calDayLabels: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  calDayLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: Colors.textDim, width: 34, textAlign: "center" },
  calGrid: { flexDirection: "row", flexWrap: "wrap" },
  calDay: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 4,
  },
  calDayToday: {},
  calDaySelected: {},
  calDayNum: {
    width: 32,
    height: 32,
    borderRadius: 10,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 32,
  },
  calDayNumToday: {
    backgroundColor: Colors.accent,
    color: "#fff",
    fontFamily: "Inter_700Bold",
    borderRadius: 10,
  },
  calDayNumSelected: {
    backgroundColor: Colors.bgElevated,
    color: Colors.text,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  calDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },

  addCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accent + "40",
    marginBottom: 16,
    gap: 10,
  },
  addTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.accent },
  addInput: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addConfirm: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  addConfirmText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: Colors.text },
  sectionCount: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },

  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgSurface,
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventBar: { width: 4, alignSelf: "stretch" },
  eventInfo: { flex: 1, padding: 14 },
  eventTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text, marginBottom: 4 },
  eventMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  eventTime: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textSecondary },
  eventDesc: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textDim, flex: 1 },
  eventTypeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 12 },
  eventTypeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 },

  empty: { alignItems: "center", paddingTop: 40, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.textSecondary },
  emptySub: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textDim },
});
