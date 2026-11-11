import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { ChatMessage, WorkflowStep } from "@/constants/mockData";

function WorkflowSteps({ steps }: { steps: WorkflowStep[] }) {
  return (
    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.workflowCard}>
      <View style={styles.workflowHeader}>
        <Ionicons name="git-network-outline" size={12} color={Colors.accentCyan} />
        <Text style={styles.workflowTitle}>OpenClaw Workflow</Text>
      </View>
      {steps.map((step, i) => {
        const statusColor = step.status === "done" ? Colors.success : step.status === "running" ? Colors.accent : step.status === "error" ? Colors.danger : Colors.textDim;
        const statusIcon = step.status === "done" ? "checkmark-circle" : step.status === "running" ? "ellipsis-horizontal-circle" : step.status === "error" ? "close-circle" : "radio-button-off";
        return (
          <View key={step.id} style={styles.workflowStep}>
            <Ionicons name={statusIcon as any} size={13} color={statusColor} />
            <View style={{ flex: 1 }}>
              <Text style={styles.workflowStepLabel}>{step.label}</Text>
              {step.detail ? <Text style={styles.workflowStepDetail}>{step.detail}</Text> : null}
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}

function parseMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={i} style={{ fontFamily: "Inter_600SemiBold", color: Colors.text }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
}

function MessageBubble({ message, isTyping }: { message: ChatMessage; isTyping?: boolean }) {
  const isUser = message.role === "user";

  return (
    <Animated.View
      entering={isUser ? FadeInRight.springify() : FadeInLeft.springify()}
      style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperAI]}
    >
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={12} color={Colors.accent} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        {isTyping ? (
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, { opacity: 0.4 }]} />
            <View style={[styles.typingDot, { opacity: 0.7 }]} />
            <View style={[styles.typingDot, { opacity: 1 }]} />
          </View>
        ) : (
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {isUser ? message.content : parseMarkdown(message.content)}
          </Text>
        )}
      </View>
      {message.workflow && !isTyping && (
        <WorkflowSteps steps={message.workflow} />
      )}
    </Animated.View>
  );
}

const TYPING_MSG: ChatMessage = {
  id: "typing",
  role: "assistant",
  content: "",
  timestamp: Date.now(),
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { conversations, sendMessage } = useApp();
  const sendScale = useSharedValue(1);
  const sendAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: sendScale.value }] }));

  const conversation = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );

  const messages = conversation?.messages ?? [];
  const displayedMessages = useMemo(() => {
    const msgs = [...messages].reverse();
    if (isSending) return [TYPING_MSG, ...msgs];
    return msgs;
  }, [messages, isSending]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput("");
    setIsSending(true);
    try {
      await sendMessage(id, text);
    } finally {
      setIsSending(false);
    }
    inputRef.current?.focus();
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Ionicons name="sparkles" size={14} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {conversation?.title || "Aria AI"}
            </Text>
            <Text style={styles.headerSub}>OpenClaw Engine active</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={displayedMessages}
        keyExtractor={(item) => item.id}
        inverted
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isTyping={item.id === "typing"}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <View style={styles.emptyChatOrb}>
              <Ionicons name="sparkles" size={32} color={Colors.accent} />
            </View>
            <Text style={styles.emptyChatTitle}>Hi, I'm Aria</Text>
            <Text style={styles.emptyChatSub}>Your AI personal assistant. Ask me to manage tasks, analyze subscriptions, schedule events, or run multi-step workflows.</Text>
          </View>
        }
      />

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Message Aria..."
          placeholderTextColor={Colors.textDim}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <Animated.View style={sendAnimStyle}>
          <Pressable
            onPress={handleSend}
            onPressIn={() => { sendScale.value = withSpring(0.9); }}
            onPressOut={() => { sendScale.value = withSpring(1); }}
            style={[styles.sendBtn, (!input.trim() || isSending) && styles.sendBtnDisabled]}
            disabled={!input.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="arrow-up" size={18} color="#fff" />
            )}
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 8,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.accent + "40",
  },
  headerTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
    maxWidth: 180,
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.accentCyan,
  },

  messageList: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    flexGrow: 1,
  },

  messageWrapper: {
    marginBottom: 12,
    maxWidth: "85%",
  },
  messageWrapperUser: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  messageWrapperAI: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },

  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: Colors.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.accent + "30",
  },

  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "100%",
  },
  bubbleUser: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: "#fff",
    fontFamily: "Inter_500Medium",
  },

  typingIndicator: {
    flexDirection: "row",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textSecondary,
  },

  workflowCard: {
    marginTop: 8,
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.accentCyan + "30",
    width: "100%",
  },
  workflowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  workflowTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.accentCyan,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  workflowStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  workflowStepLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.text,
  },
  workflowStepDetail: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.bgSurface,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 120,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.bgElevated,
  },

  emptyChat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
    paddingTop: 80,
  },
  emptyChatOrb: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.accentGlow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.accent + "40",
    marginBottom: 8,
  },
  emptyChatTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: Colors.text,
  },
  emptyChatSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
