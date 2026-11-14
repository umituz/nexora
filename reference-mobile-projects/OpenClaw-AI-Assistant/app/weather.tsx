import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function WeatherDayCard({ day, index }: { day: any; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50 + 200).springify()} style={styles.dayCard}>
      <Text style={styles.dayName}>{day.day}</Text>
      <Ionicons name={day.icon as any} size={22} color={day.color} />
      <Text style={styles.dayHigh}>{day.high}°</Text>
      <Text style={styles.dayLow}>{day.low}°</Text>
    </Animated.View>
  );
}

export default function WeatherScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { weather } = useApp();
  if (!weather) return null;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Weather</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.currentCard}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.location}>{weather.city}, {weather.country}</Text>
          </View>
          <View style={styles.mainWeather}>
            <Ionicons name={weather.current.icon as any} size={64} color={weather.current.color} />
            <View style={styles.tempBlock}>
              <Text style={styles.temp}>{weather.current.temp}°</Text>
              <Text style={styles.feelsLike}>Feels like {weather.current.feelsLike}°</Text>
              <Text style={styles.condition}>{weather.current.condition}</Text>
            </View>
          </View>
          <View style={styles.detailsRow}>
            {[
              { icon: "water-outline", label: "Humidity", value: `${weather.current.humidity}%`, color: Colors.accentCyan },
              { icon: "speedometer-outline", label: "Wind", value: `${weather.current.wind} km/h`, color: Colors.accent },
              { icon: "eye-outline", label: "Visibility", value: `${weather.current.visibility} km`, color: Colors.accentViolet },
              { icon: "umbrella-outline", label: "Rain", value: `${weather.current.precipChance}%`, color: "#4F8EF7" },
            ].map((d) => (
              <View key={d.label} style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: d.color + "20" }]}>
                  <Ionicons name={d.icon as any} size={14} color={d.color} />
                </View>
                <Text style={styles.detailValue}>{d.value}</Text>
                <Text style={styles.detailLabel}>{d.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.hourlyCard}>
          <Text style={styles.sectionTitle}>Hourly</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}>
            {weather.hourly.map((h: any, i: number) => (
              <View key={i} style={styles.hourItem}>
                <Text style={styles.hourTime}>{h.time}</Text>
                <Ionicons name={h.icon as any} size={18} color={h.color} />
                <Text style={styles.hourTemp}>{h.temp}°</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.forecastCard}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          <View style={styles.forecastRow}>
            {weather.weekly.map((day: any, i: number) => <WeatherDayCard key={i} day={day} index={i} />)}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).springify()} style={styles.aiCard}>
          <View style={styles.aiRow}>
            <Ionicons name="sparkles" size={14} color={Colors.accent} />
            <Text style={styles.aiTitle}>AI Weather Tip</Text>
          </View>
          <Text style={styles.aiText}>{weather.aiTip}</Text>
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
  currentCard: { backgroundColor: Colors.bgSurface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, gap: 16 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  mainWeather: { flexDirection: "row", alignItems: "center", gap: 16 },
  tempBlock: { gap: 2 },
  temp: { fontFamily: "Inter_700Bold", fontSize: 56, color: Colors.text, letterSpacing: -2 },
  feelsLike: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  condition: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text },
  detailsRow: { flexDirection: "row", justifyContent: "space-between" },
  detailItem: { alignItems: "center", gap: 4 },
  detailIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  detailValue: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.text },
  detailLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary },
  hourlyCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, gap: 12 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  hourItem: { alignItems: "center", gap: 6, paddingHorizontal: 4 },
  hourTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary },
  hourTemp: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  forecastCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, gap: 14 },
  forecastRow: { flexDirection: "row", justifyContent: "space-between" },
  dayCard: { alignItems: "center", gap: 6 },
  dayName: { fontFamily: "Inter_500Medium", fontSize: 11, color: Colors.textSecondary },
  dayHigh: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  dayLow: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textDim },
  aiCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, gap: 6 },
  aiRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  aiTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.accent },
  aiText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
});
