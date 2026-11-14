import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const INTEGRATIONS = [
  { id: "i1", name: "Google Calendar", icon: "calendar-outline", connected: true },
  { id: "i2", name: "Gmail", icon: "mail-outline", connected: true },
  { id: "i3", name: "Slack", icon: "chatbubbles-outline", connected: false },
  { id: "i4", name: "Notion", icon: "document-text-outline", connected: false },
  { id: "i5", name: "Stripe", icon: "card-outline", connected: true },
  { id: "i6", name: "GitHub", icon: "logo-github", connected: false },
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["5 AI conversations/day", "Basic task management", "Calendar sync", "Email digest"],
    color: Colors.textSecondary,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$12",
    period: "/mo",
    features: ["Unlimited AI conversations", "Advanced OpenClaw workflows", "All integrations", "Priority support", "Team sharing"],
    color: Colors.accent,
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$29",
    period: "/mo",
    features: ["Everything in Premium", "Up to 10 members", "Shared workflows", "Admin controls", "Analytics dashboard"],
    color: Colors.accentViolet,
  },
];

function IntegrationRow({ item, index }: { item: any; index: number }) {
  const [connected, setConnected] = useState(item.connected);
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()} style={animStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setConnected(!connected); }}
        style={styles.integrationRow}
      >
        <View style={[styles.integrationIcon, { backgroundColor: connected ? Colors.accentGlow : Colors.bgElevated }]}>
          <Ionicons name={item.icon} size={18} color={connected ? Colors.accent : Colors.textSecondary} />
        </View>
        <Text style={styles.integrationName}>{item.name}</Text>
        <View style={[styles.integrationStatus, { backgroundColor: connected ? Colors.success + "20" : Colors.bgElevated }]}>
          <Text style={[styles.integrationStatusText, { color: connected ? Colors.success : Colors.textDim }]}>
            {connected ? "Connected" : "Connect"}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function PlanCard({ plan, isSelected, onSelect, index }: any) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 60).springify()} style={animStyle}>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onSelect(); }}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[
          styles.planCard,
          isSelected && { borderColor: plan.color, borderWidth: 1.5 },
          plan.highlight && styles.planCardHighlight,
        ]}
      >
        {plan.highlight && (
          <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
            <Text style={styles.planBadgeText}>Most Popular</Text>
          </View>
        )}
        <View style={styles.planHeader}>
          <Text style={[styles.planName, { color: isSelected ? plan.color : Colors.text }]}>{plan.name}</Text>
          <View style={styles.planPriceRow}>
            <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
            <Text style={styles.planPeriod}>{plan.period}</Text>
          </View>
        </View>
        {plan.features.map((f: string) => (
          <View key={f} style={styles.planFeature}>
            <Ionicons name="checkmark-circle" size={14} color={plan.color} />
            <Text style={styles.planFeatureText}>{f}</Text>
          </View>
        ))}
        {isSelected && (
          <View style={[styles.planSelectedBadge, { backgroundColor: plan.color }]}>
            <Text style={styles.planSelectedText}>Current Plan</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

function SettingToggle({ label, icon, value, onChange }: any) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={18} color={Colors.textSecondary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.border, true: Colors.accent + "80" }}
        thumbColor={value ? Colors.accent : Colors.textDim}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium, setIsPremium } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(isPremium ? "premium" : "free");

  useEffect(() => {
    setSelectedPlan(isPremium ? "premium" : "free");
  }, [isPremium]);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setIsPremium(planId === "premium" || planId === "team");
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={Colors.accent} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex Johnson</Text>
            <Text style={styles.profileEmail}>alex.j@example.com</Text>
          </View>
          <View style={[styles.tierBadge, { backgroundColor: isPremium ? Colors.accent + "20" : Colors.bgElevated }]}>
            <Ionicons name={isPremium ? "star" : "star-outline"} size={12} color={isPremium ? Colors.accent : Colors.textDim} />
            <Text style={[styles.tierText, { color: isPremium ? Colors.accent : Colors.textDim }]}>
              {isPremium ? "Premium" : "Free"}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <View style={styles.plansContainer}>
            {PLANS.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={() => handlePlanSelect(plan.id)}
                index={i}
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Integrations</Text>
          {INTEGRATIONS.map((item, i) => (
            <IntegrationRow key={item.id} item={item} index={i} />
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingToggle label="Push Notifications" icon="notifications-outline" value={notifications} onChange={setNotifications} />
          <SettingToggle label="Weekly AI Report" icon="bar-chart-outline" value={weeklyReport} onChange={setWeeklyReport} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textDim }}>Always on</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(380).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>OpenClaw Engine</Text>
            <Text style={[styles.aboutValue, { color: Colors.success }]}>v2.4 Active</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>AI Model</Text>
            <Text style={styles.aboutValue}>Aria-7 (Mock)</Text>
          </View>
        </Animated.View>

        <View style={{ height: Platform.OS === "web" ? 34 : 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: Colors.text, letterSpacing: -0.5 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  profileCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.accent + "40",
  },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: Colors.text },
  profileEmail: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tierText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
    marginBottom: 12,
    paddingLeft: 4,
  },

  plansContainer: { gap: 12 },
  planCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    overflow: "hidden",
  },
  planCardHighlight: { backgroundColor: Colors.bgElevated },
  planBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  planBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "#fff" },
  planHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 },
  planName: { fontFamily: "Inter_700Bold", fontSize: 17, color: Colors.text },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  planPrice: { fontFamily: "Inter_700Bold", fontSize: 22 },
  planPeriod: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  planFeature: { flexDirection: "row", alignItems: "center", gap: 8 },
  planFeatureText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  planSelectedBadge: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  planSelectedText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#fff" },

  integrationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  integrationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  integrationName: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
  integrationStatus: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  integrationStatusText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },

  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  aboutLabel: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
  aboutValue: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
});
