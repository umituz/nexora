import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const NOTE_COLORS = ["#4F8EF7", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

export default function NoteScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, updateNote, deleteNote } = useApp();
  const note = notes.find((n) => n.id === id);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [pinned, setPinned] = useState(note?.pinned || false);
  const [color, setColor] = useState(note?.color || Colors.accent);

  useEffect(() => {
    if (note) { setTitle(note.title); setContent(note.content); setPinned(note.pinned); setColor(note.color); }
  }, [note]);

  if (!note) {
    return (
      <View style={[styles.container, { paddingTop: Platform.OS === "web" ? 67 : 60, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.textSecondary }}>Note not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.accent }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateNote(id, { title, content, pinned, color });
    router.back();
  };

  const handleDelete = () => {
    Alert.alert("Delete note", "This note will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteNote(id);
          router.back();
        },
      },
    ]);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={() => { setPinned(!pinned); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
            <Ionicons name={pinned ? "pin" : "pin-outline"} size={20} color={pinned ? Colors.accent : Colors.textSecondary} />
          </Pressable>
          <Pressable onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </Pressable>
          <Pressable onPress={handleSave} style={[styles.saveBtn, { backgroundColor: color }]}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.colorRow}>
        {NOTE_COLORS.map((c) => (
          <Pressable key={c} onPress={() => { setColor(c); Haptics.selectionAsync(); }} style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          style={[styles.titleInput, { borderBottomColor: color + "40" }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Note title..."
          placeholderTextColor={Colors.textDim}
          multiline
        />
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing your note..."
          placeholderTextColor={Colors.textDim}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <Ionicons name="sparkles" size={14} color={Colors.accentCyan} />
        <Text style={styles.footerText}>AI summary available · {wordCount} words</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 16 },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  saveBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
  colorRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  colorDot: { width: 22, height: 22, borderRadius: 11 },
  colorDotSelected: { transform: [{ scale: 1.3 }], borderWidth: 2, borderColor: "#fff" },
  content: { paddingHorizontal: 20, paddingBottom: 60 },
  titleInput: { fontFamily: "Inter_700Bold", fontSize: 24, color: Colors.text, marginBottom: 16, borderBottomWidth: 1.5, paddingBottom: 12, letterSpacing: -0.3 },
  contentInput: { fontFamily: "Inter_400Regular", fontSize: 16, color: Colors.textSecondary, lineHeight: 26, minHeight: 300 },
  footer: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  footerText: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textDim },
});
