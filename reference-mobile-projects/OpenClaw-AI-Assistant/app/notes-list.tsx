import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function NoteCard({ note, index, onPress }: { note: any; index: number; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const timeAgo = note.updatedAt > Date.now() - 3600000 ? "Just now" : note.updatedAt > Date.now() - 86400000 ? `${Math.floor((Date.now() - note.updatedAt) / 3600000)}h ago` : `${Math.floor((Date.now() - note.updatedAt) / 86400000)}d ago`;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()} style={animStyle}>
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[styles.noteCard, { borderLeftColor: note.color }]}
      >
        {note.pinned && <View style={styles.pinnedBadge}><Ionicons name="pin" size={10} color={Colors.accent} /></View>}
        <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
        <Text style={styles.notePreview} numberOfLines={2}>{note.content}</Text>
        {note.aiSummary && (
          <View style={styles.aiSummaryRow}>
            <Ionicons name="sparkles" size={10} color={Colors.accentCyan} />
            <Text style={styles.aiSummaryText} numberOfLines={1}>{note.aiSummary}</Text>
          </View>
        )}
        <View style={styles.noteFooter}>
          <View style={styles.tagRow}>
            {note.tags.slice(0, 2).map((t: string) => (
              <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
            ))}
          </View>
          <Text style={styles.noteTime}>{timeAgo}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function NotesListScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { notes, addNote, deleteNote } = useApp();
  const [search, setSearch] = useState("");

  const filtered = notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));
  const pinned = filtered.filter((n) => n.pinned);
  const other = filtered.filter((n) => !n.pinned);

  const handleNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const id = addNote({ title: "New note", content: "", tags: [], pinned: false, color: Colors.accent });
    router.push({ pathname: "/note/[id]", params: { id } });
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Notes</Text>
        <Pressable onPress={handleNew} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color={Colors.textDim} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={Colors.textDim}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && <Pressable onPress={() => setSearch("")}><Ionicons name="close-circle" size={16} color={Colors.textDim} /></Pressable>}
      </View>

      <FlatList
        data={[...pinned, ...other]}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          pinned.length > 0 ? (
            <Text style={styles.sectionLabel}>Pinned</Text>
          ) : null
        }
        renderItem={({ item, index }) => (
          <>
            {!item.pinned && index === pinned.length && other.length > 0 && (
              <Text style={styles.sectionLabel}>All Notes</Text>
            )}
            <NoteCard note={item} index={index} onPress={() => router.push({ pathname: "/note/[id]", params: { id: item.id } })} />
          </>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyText}>No notes yet</Text>
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
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgSurface, marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.text },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: Colors.textDim, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10, marginTop: 4 },
  noteCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 10, borderLeftWidth: 3, gap: 6 },
  pinnedBadge: { position: "absolute", top: 10, right: 10 },
  noteTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  notePreview: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  aiSummaryRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  aiSummaryText: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.accentCyan, flex: 1 },
  noteFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tagRow: { flexDirection: "row", gap: 5 },
  tag: { backgroundColor: Colors.bgElevated, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontFamily: "Inter_500Medium", fontSize: 10, color: Colors.textSecondary },
  noteTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textDim },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.textSecondary },
});
