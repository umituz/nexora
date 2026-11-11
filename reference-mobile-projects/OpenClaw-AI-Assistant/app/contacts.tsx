import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const CONTACT_COLORS = ["#4F8EF7", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

function ContactRow({ contact, index }: { contact: any; index: number }) {
  const color = CONTACT_COLORS[index % CONTACT_COLORS.length];
  const isFavorite = contact.tags?.includes("vip") || contact.tags?.includes("manager");
  const isWork = contact.tags?.includes("work");

  return (
    <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
      <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.contactRow}>
        <View style={[styles.avatar, { backgroundColor: color + "25" }]}>
          <Text style={[styles.avatarText, { color }]}>{contact.avatar}</Text>
        </View>
        <View style={styles.contactInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.contactName}>{contact.name}</Text>
            {isFavorite && <Ionicons name="star" size={11} color={Colors.warning} />}
          </View>
          <Text style={styles.contactRole}>{contact.role} · {contact.company}</Text>
        </View>
        <View style={styles.contactActions}>
          <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.actionBtn}>
            <Ionicons name="call-outline" size={16} color={Colors.success} />
          </Pressable>
          <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={16} color={Colors.accent} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { contacts } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    if (filter === "Favorites") return matchSearch && (c.tags?.includes("vip") || c.tags?.includes("manager"));
    if (filter === "Work") return matchSearch && c.tags?.includes("work");
    return matchSearch;
  });

  const favorites = filtered.filter((c) => c.tags?.includes("vip") || c.tags?.includes("manager")).slice(0, 5);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Contacts</Text>
        <Pressable onPress={() => Alert.alert("Add Contact", "Contact creation coming soon.")} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color={Colors.textDim} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={Colors.textDim}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        {["All", "Favorites", "Work"].map((f) => (
          <Pressable key={f} onPress={() => { Haptics.selectionAsync(); setFilter(f); }} style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          favorites.length > 0 && filter === "All" ? (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.sectionLabel}>Favorites</Text>
              <View style={styles.favRow}>
                {favorites.map((c, i) => {
                  const color = CONTACT_COLORS[i % CONTACT_COLORS.length];
                  return (
                    <Pressable key={c.id} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.favItem}>
                      <View style={[styles.favAvatar, { backgroundColor: color + "25" }]}>
                        <Text style={[styles.favAvatarText, { color }]}>{c.avatar}</Text>
                      </View>
                      <Text style={styles.favName} numberOfLines={1}>{c.name.split(" ")[0]}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={[styles.sectionLabel, { marginTop: 14 }]}>All Contacts</Text>
            </View>
          ) : <View style={{ paddingHorizontal: 20 }}><Text style={styles.sectionLabel}>Contacts</Text></View>
        }
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <ContactRow contact={item} index={index} />
          </View>
        )}
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
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgSurface, marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.text },
  filterRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  filterBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  filterTextActive: { color: "#fff" },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: Colors.textDim, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 },
  favRow: { flexDirection: "row", gap: 12 },
  favItem: { alignItems: "center", gap: 6 },
  favAvatar: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  favAvatarText: { fontFamily: "Inter_700Bold", fontSize: 16 },
  favName: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, maxWidth: 52, textAlign: "center" },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 16 },
  contactInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  contactName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  contactRole: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  contactActions: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
});
