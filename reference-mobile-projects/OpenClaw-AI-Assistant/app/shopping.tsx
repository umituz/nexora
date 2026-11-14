import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function ShoppingItem({ item, index, onToggle }: { item: any; index: number; onToggle: () => void }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 35).springify()}>
      <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onToggle(); }} style={styles.itemRow}>
        <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
          {item.done && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, item.done && styles.itemNameDone]}>{item.name}</Text>
          <Text style={styles.itemMeta}>{item.category} · {item.qty}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ShoppingScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { shoppingLists, toggleShoppingItem, addShoppingItem, addShoppingList } = useApp();
  const [activeListId, setActiveListId] = useState(shoppingLists[0]?.id || "");
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed || !currentList) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addShoppingItem(currentList.id, { name: trimmed, qty: "1", done: false, category: "General" });
    setNewItem("");
  };

  const currentList = shoppingLists.find((l) => l.id === activeListId) || shoppingLists[0];
  const checkedCount = currentList?.items.filter((i) => i.done).length || 0;
  const totalItems = currentList?.items.length || 0;

  const handleAddList = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addShoppingList({ name: "New List", items: [], color: Colors.accent });
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Shopping</Text>
        <Pressable onPress={handleAddList} style={styles.listViewBtn}>
          <Ionicons name="add" size={20} color={Colors.text} />
        </Pressable>
      </View>

      {shoppingLists.length > 1 && (
        <View style={styles.listsRow}>
          {shoppingLists.map((l) => (
            <Pressable key={l.id} onPress={() => { Haptics.selectionAsync(); setActiveListId(l.id); }} style={[styles.listBtn, l.id === activeListId && styles.listBtnActive]}>
              <View style={[styles.listDot, { backgroundColor: l.color }]} />
              <Text style={[styles.listBtnText, l.id === activeListId && styles.listBtnTextActive]}>{l.name}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalItems}</Text>
          <Text style={styles.summaryLabel}>Items</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: Colors.success }]}>{checkedCount}</Text>
          <Text style={styles.summaryLabel}>Done</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: Colors.warning }]}>{totalItems - checkedCount}</Text>
          <Text style={styles.summaryLabel}>Remaining</Text>
        </View>
      </Animated.View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          placeholder="Add item..."
          placeholderTextColor={Colors.textDim}
          value={newItem}
          onChangeText={setNewItem}
          returnKeyType="done"
          onSubmitEditing={handleAddItem}
        />
        <Pressable onPress={handleAddItem} style={[styles.addBtn, { opacity: newItem.trim() ? 1 : 0.4 }]}>
          <Ionicons name="add" size={20} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={currentList?.items || []}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <ShoppingItem item={item} index={index} onToggle={() => currentList && toggleShoppingItem(currentList.id, item.id)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyText}>Your list is empty</Text>
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
  listViewBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  listsRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 12, flexWrap: "wrap" },
  listBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  listBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  listDot: { width: 8, height: 8, borderRadius: 4 },
  listBtnText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  listBtnTextActive: { color: "#fff" },
  summaryCard: { flexDirection: "row", backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  addRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 12 },
  addInput: { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  addBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.accent, alignItems: "center", justifyContent: "center" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  checkboxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.text },
  itemNameDone: { color: Colors.textDim, textDecorationLine: "line-through" },
  itemMeta: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.textSecondary },
});
