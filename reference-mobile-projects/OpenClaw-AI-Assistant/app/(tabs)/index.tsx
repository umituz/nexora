import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { WORKFLOW_TEMPLATES } from "@/constants/mockData";

function ConversationItem({ item, index, onDelete }: { item: any; index: number; onDelete: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/chat/[id]", params: { id: item.id } });
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Delete conversation",
      `"${item.title}" will be permanently deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()} style={animStyle}>
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.convItem}
      >
        <View style={styles.convIcon}>
          <Ionicons name="sparkles" size={18} color={Colors.accent} />
        </View>
        <View style={styles.convContent}>
          <Text style={styles.convTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.convPreview} numberOfLines={1}>{item.preview}</Text>
        </View>
        <Text style={styles.convTime}>{item.lastMessage}</Text>
      </Pressable>
    </Animated.View>
  );
}

function QuickAction({ item, index }: { item: any; index: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const { createConversation, sendMessage, setActiveConversationId } = useApp();

  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const id = createConversation();
    setActiveConversationId(id);
    router.push({ pathname: "/chat/[id]", params: { id } });
    setTimeout(() => sendMessage(id, item.label), 200);
  };

  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 50).springify()} style={animStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.quickAction}
      >
        <Ionicons name={item.icon as any} size={20} color={Colors.accent} />
        <Text style={styles.quickActionText}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const { conversations, createConversation, deleteConversation, setActiveConversationId } = useApp();

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const id = createConversation();
    setActiveConversationId(id);
    router.push({ pathname: "/chat/[id]", params: { id } });
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>Aria AI</Text>
        </View>
        <Pressable onPress={handleNewChat} style={styles.newBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.sectionLabel}>Quick Actions</Text>
            <View style={styles.quickGrid}>
              {WORKFLOW_TEMPLATES.map((t, idx) => (
                <QuickAction key={t.id} item={t} index={idx} />
              ))}
            </View>
            <Text style={styles.sectionLabel}>Recent</Text>
          </>
        }
        renderItem={({ item, index }) => <ConversationItem item={item} index={index} onDelete={() => deleteConversation(item.id)} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={40} color={Colors.textDim} />
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>Tap + to start a new chat with Aria</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  newBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgSurface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.textDim,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 8,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  quickActionText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
  },
  convItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  convIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  convContent: {
    flex: 1,
  },
  convTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
    marginBottom: 2,
  },
  convPreview: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  convTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textDim,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textDim,
    textAlign: "center",
  },
});
