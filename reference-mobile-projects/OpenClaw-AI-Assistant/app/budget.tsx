import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function CategoryBar({ cat, index }: { cat: any; index: number }) {
  const pct = Math.min((cat.spent / cat.budget) * 100, 100);
  const isOverBudget = cat.spent > cat.budget;
  const barColor = isOverBudget ? Colors.danger : pct > 80 ? Colors.warning : Colors.success;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()} style={styles.catRow}>
      <View style={[styles.catIcon, { backgroundColor: cat.color + "20" }]}>
        <Ionicons name={cat.icon as any} size={16} color={cat.color} />
      </View>
      <View style={styles.catInfo}>
        <View style={styles.catHeader}>
          <Text style={styles.catName}>{cat.name}</Text>
          <View style={styles.catAmounts}>
            <Text style={[styles.catSpent, { color: isOverBudget ? Colors.danger : Colors.text }]}>${cat.spent}</Text>
            <Text style={styles.catBudget}> / ${cat.budget}</Text>
          </View>
        </View>
        <View style={styles.catBar}>
          <Animated.View style={[styles.catBarFill, { width: `${pct}%` as any, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.catPct}>{Math.round(pct)}% used{isOverBudget ? " · OVER BUDGET" : ""}</Text>
      </View>
    </Animated.View>
  );
}

function TransactionRow({ tx, index }: { tx: any; index: number }) {
  return (
    <Animated.View entering={FadeInRight.delay(index * 40).springify()} style={styles.txRow}>
      <View style={[styles.txIcon, { backgroundColor: tx.color + "20" }]}>
        <Ionicons name={tx.icon as any} size={16} color={tx.color} />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txTitle}>{tx.title}</Text>
        <Text style={styles.txMeta}>{tx.category} · {tx.date}</Text>
      </View>
      <Text style={[styles.txAmount, { color: tx.type === "income" ? Colors.success : Colors.text }]}>
        {tx.type === "income" ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
      </Text>
    </Animated.View>
  );
}

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { budgetCategories, transactions, savingsGoals, totalBudget, totalSpent } = useApp();
  const [tab, setTab] = useState<"budget" | "transactions" | "savings">("budget");

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Budget</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>${income.toFixed(0)}</Text>
              <Text style={styles.summaryLabel}>Income</Text>
            </View>
            <View style={[styles.summaryDivider]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.danger }]}>${expenses.toFixed(0)}</Text>
              <Text style={styles.summaryLabel}>Expenses</Text>
            </View>
            <View style={[styles.summaryDivider]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.accent }]}>${(income - expenses).toFixed(0)}</Text>
              <Text style={styles.summaryLabel}>Net</Text>
            </View>
          </View>
          <View style={styles.overallBar}>
            <View style={[styles.overallFill, { width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` as any }]} />
          </View>
          <Text style={styles.overallText}>${totalSpent.toFixed(0)} of ${totalBudget.toFixed(0)} budget used this month</Text>
        </Animated.View>

        <View style={styles.tabRow}>
          {(["budget", "transactions", "savings"] as const).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
            </Pressable>
          ))}
        </View>

        {tab === "budget" && budgetCategories.map((cat, i) => <CategoryBar key={cat.id} cat={cat} index={i} />)}

        {tab === "transactions" && (
          <View style={styles.section}>
            {transactions.map((tx, i) => <TransactionRow key={tx.id} tx={tx} index={i} />)}
          </View>
        )}

        {tab === "savings" && (
          <>
            {savingsGoals.map((goal, i) => {
              const pct = Math.round((goal.current / goal.target) * 100);
              return (
                <Animated.View key={goal.id} entering={FadeInDown.delay(i * 60).springify()} style={styles.savingsCard}>
                  <View style={styles.savingsHeader}>
                    <View style={[styles.savingsIcon, { backgroundColor: goal.color + "20" }]}>
                      <Ionicons name={goal.icon as any} size={18} color={goal.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.savingsName}>{goal.name}</Text>
                      <Text style={styles.savingsDeadline}>Target: {goal.deadline}</Text>
                    </View>
                    <View style={[styles.savingsPct, { backgroundColor: goal.color + "20" }]}>
                      <Text style={[styles.savingsPctText, { color: goal.color }]}>{pct}%</Text>
                    </View>
                  </View>
                  <View style={styles.savingsBar}>
                    <View style={[styles.savingsBarFill, { width: `${pct}%` as any, backgroundColor: goal.color }]} />
                  </View>
                  <Text style={styles.savingsAmounts}>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</Text>
                </Animated.View>
              );
            })}
          </>
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
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  summaryCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, gap: 12 },
  summaryTop: { flexDirection: "row", alignItems: "center" },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 20 },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, height: 36, backgroundColor: Colors.border },
  overallBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  overallFill: { height: 6, backgroundColor: Colors.accent, borderRadius: 3 },
  overallText: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, textAlign: "center" },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 12, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  tabBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  tabTextActive: { color: "#fff" },
  catRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.bgSurface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  catIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  catInfo: { flex: 1, gap: 5 },
  catHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  catName: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
  catAmounts: { flexDirection: "row", alignItems: "baseline" },
  catSpent: { fontFamily: "Inter_700Bold", fontSize: 15 },
  catBudget: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  catBar: { height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  catBarFill: { height: 5, borderRadius: 3 },
  catPct: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary },
  section: { gap: 0 },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1 },
  txTitle: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
  txMeta: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  txAmount: { fontFamily: "Inter_700Bold", fontSize: 15 },
  savingsCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12, gap: 10 },
  savingsHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  savingsIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  savingsName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  savingsDeadline: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  savingsPct: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  savingsPctText: { fontFamily: "Inter_700Bold", fontSize: 15 },
  savingsBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  savingsBarFill: { height: 6, borderRadius: 3 },
  savingsAmounts: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
});
