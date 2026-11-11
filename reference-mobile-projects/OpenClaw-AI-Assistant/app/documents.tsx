import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const TAG_ICONS: Record<string, { icon: string; color: string }> = {
  identity: { icon: "id-card-outline", color: "#4F8EF7" },
  travel: { icon: "airplane-outline", color: "#8B5CF6" },
  health: { icon: "heart-outline", color: "#EF4444" },
  insurance: { icon: "shield-outline", color: "#10B981" },
  housing: { icon: "home-outline", color: "#4F8EF7" },
  legal: { icon: "document-text-outline", color: "#F59E0B" },
  finance: { icon: "card-outline", color: "#10B981" },
  tax: { icon: "receipt-outline", color: "#F59E0B" },
  car: { icon: "car-outline", color: "#EF4444" },
  work: { icon: "briefcase-outline", color: "#06B6D4" },
};

function DocRow({ doc, index }: { doc: any; index: number }) {
  const folder = doc.tags?.[0] || "other";
  const typeInfo = TAG_ICONS[folder] || { icon: "document-outline", color: Colors.textSecondary };

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
      <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.docRow}>
        <View style={[styles.docIcon, { backgroundColor: doc.color + "20" }]}>
          <Ionicons name={typeInfo.icon as any} size={20} color={doc.color} />
        </View>
        <View style={styles.docInfo}>
          <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
          <Text style={styles.docMeta}>{doc.type} · {doc.size} · Updated {doc.updatedAt}</Text>
          {doc.aiSummary && <Text style={styles.docSummary} numberOfLines={1}>{doc.aiSummary}</Text>}
        </View>
        <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Ionicons name="ellipsis-vertical" size={16} color={Colors.textDim} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { documents } = useApp();
  const [filter, setFilter] = useState("all");

  const allFolders = ["all", ...new Set(documents.flatMap((d) => d.tags.slice(0, 1)))];

  const filtered = filter === "all" ? documents : documents.filter((d) => d.tags.includes(filter));

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Documents</Text>
        <Pressable onPress={() => Alert.alert("Upload Document", "Document upload coming soon.")} style={styles.uploadBtn}>
          <Ionicons name="cloud-upload-outline" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.storageCard}>
              <View style={styles.storageInfo}>
                <Text style={styles.storageTitle}>Vault Storage</Text>
                <Text style={styles.storageUsed}>{documents.length} documents secured</Text>
                <View style={styles.storageBar}>
                  <View style={[styles.storageFill, { width: "24%" }]} />
                </View>
                <Text style={styles.storageNote}>AI-powered document insights enabled</Text>
              </View>
              <View style={[styles.storageIcon, { backgroundColor: Colors.accentViolet + "20" }]}>
                <Ionicons name="shield-checkmark-outline" size={28} color={Colors.accentViolet} />
              </View>
            </Animated.View>
            <View style={styles.folderRow}>
              {allFolders.map((f) => {
                const info = TAG_ICONS[f] || { icon: "folder-outline", color: Colors.textSecondary };
                return (
                  <Pressable key={f} onPress={() => { Haptics.selectionAsync(); setFilter(f); }} style={[styles.folderBtn, filter === f && styles.folderBtnActive]}>
                    <Ionicons name={(f === "all" ? "folder-outline" : info.icon) as any} size={13} color={filter === f ? "#fff" : Colors.textSecondary} />
                    <Text style={[styles.folderText, filter === f && styles.folderTextActive]}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.resultCount}>{filtered.length} documents</Text>
          </View>
        }
        renderItem={({ item, index }) => <DocRow doc={item} index={index} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  uploadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  storageCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 14 },
  storageInfo: { flex: 1, gap: 5 },
  storageTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  storageUsed: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  storageBar: { height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  storageFill: { height: 5, backgroundColor: Colors.accentViolet, borderRadius: 3 },
  storageNote: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.accentCyan },
  storageIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  folderRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  folderBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  folderBtnActive: { backgroundColor: Colors.accentViolet, borderColor: Colors.accentViolet },
  folderText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  folderTextActive: { color: "#fff" },
  resultCount: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textDim, marginBottom: 10 },
  docRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  docIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  docInfo: { flex: 1, gap: 2 },
  docName: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.text },
  docMeta: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary },
  docSummary: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.accentCyan },
});
