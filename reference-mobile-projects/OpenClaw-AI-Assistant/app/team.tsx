import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const MEMBER_COLORS = ["#4F8EF7", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

const TEAM_PROJECTS = [
  { id: "p1", name: "Product Redesign", status: "In Progress", statusColor: Colors.accent, progress: 65, color: "#4F8EF7", dueDate: "Mar 15", members: [0, 1, 2] },
  { id: "p2", name: "API v2 Migration", status: "Planning", statusColor: Colors.warning, progress: 20, color: "#8B5CF6", dueDate: "Apr 1", members: [2, 4] },
  { id: "p3", name: "User Research Q1", status: "Complete", statusColor: Colors.success, progress: 100, color: "#10B981", dueDate: "Feb 28", members: [0, 3] },
  { id: "p4", name: "Analytics Dashboard", status: "In Progress", statusColor: Colors.accent, progress: 45, color: "#F59E0B", dueDate: "Mar 20", members: [1, 4] },
];

function MemberRow({ member, index }: { member: any; index: number }) {
  const color = MEMBER_COLORS[index % MEMBER_COLORS.length];
  const statusColor = member.status === "online" ? Colors.success : member.status === "away" ? Colors.warning : Colors.textDim;
  const progress = Math.round((member.completedTasks / Math.max(member.tasks, 1)) * 100);

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()} style={styles.memberRow}>
      <View style={styles.memberAvatarWrap}>
        <View style={[styles.memberAvatar, { backgroundColor: color + "25" }]}>
          <Text style={[styles.memberInitials, { color }]}>{member.avatar}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberRole}>{member.role}</Text>
        <View style={styles.taskProgress}>
          <View style={styles.taskBar}>
            <View style={[styles.taskBarFill, { width: `${progress}%` as any, backgroundColor: color }]} />
          </View>
          <Text style={styles.taskText}>{member.completedTasks}/{member.tasks} tasks</Text>
        </View>
      </View>
      <View style={styles.memberActions}>
        <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={15} color={Colors.accent} />
        </Pressable>
        <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.actionBtn}>
          <Ionicons name="videocam-outline" size={15} color={Colors.accentCyan} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

function ProjectCard({ project, index, memberColors }: { project: any; index: number; memberColors: string[] }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()} style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View style={[styles.projectDot, { backgroundColor: project.color }]} />
        <Text style={styles.projectName}>{project.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: project.statusColor + "20" }]}>
          <Text style={[styles.statusText, { color: project.statusColor }]}>{project.status}</Text>
        </View>
      </View>
      <View style={styles.projectProgress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${project.progress}%` as any, backgroundColor: project.color }]} />
        </View>
        <Text style={[styles.progressPct, { color: project.color }]}>{project.progress}%</Text>
      </View>
      <View style={styles.projectFooter}>
        <View style={styles.memberStack}>
          {project.members.slice(0, 3).map((i: number, idx: number) => (
            <View key={idx} style={[styles.stackAvatar, { backgroundColor: memberColors[i % memberColors.length] + "25", marginLeft: idx > 0 ? -8 : 0, zIndex: 3 - idx }]}>
              <View style={[styles.stackDot, { backgroundColor: memberColors[i % memberColors.length] }]} />
            </View>
          ))}
        </View>
        <View style={styles.dueDateRow}>
          <Ionicons name="calendar-outline" size={11} color={Colors.textDim} />
          <Text style={styles.projectDue}>Due {project.dueDate}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function TeamScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { teamMembers } = useApp();
  const [tab, setTab] = useState<"members" | "projects">("members");
  const onlineCount = teamMembers.filter((m) => m.status === "online").length;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Team</Text>
        <Pressable onPress={() => Alert.alert("Invite Member", "Team invites coming soon.")} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconWrap, { backgroundColor: Colors.accent + "20" }]}><Ionicons name="people-outline" size={16} color={Colors.accent} /></View>
            <Text style={styles.summaryValue}>{teamMembers.length}</Text>
            <Text style={styles.summaryLabel}>Members</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconWrap, { backgroundColor: Colors.success + "20" }]}><Ionicons name="radio-button-on-outline" size={16} color={Colors.success} /></View>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>{onlineCount}</Text>
            <Text style={styles.summaryLabel}>Online</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconWrap, { backgroundColor: Colors.accentViolet + "20" }]}><Ionicons name="briefcase-outline" size={16} color={Colors.accentViolet} /></View>
            <Text style={styles.summaryValue}>{TEAM_PROJECTS.length}</Text>
            <Text style={styles.summaryLabel}>Projects</Text>
          </View>
        </Animated.View>

        <View style={styles.tabRow}>
          <Pressable onPress={() => setTab("members")} style={[styles.tabBtn, tab === "members" && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === "members" && styles.tabTextActive]}>Members</Text>
          </Pressable>
          <Pressable onPress={() => setTab("projects")} style={[styles.tabBtn, tab === "projects" && styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab === "projects" && styles.tabTextActive]}>Projects</Text>
          </Pressable>
        </View>

        {tab === "members" && teamMembers.map((m, i) => <MemberRow key={m.id} member={m} index={i} />)}
        {tab === "projects" && TEAM_PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} memberColors={MEMBER_COLORS} />)}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  summaryCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, flexDirection: "row", borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  summaryItem: { flex: 1, alignItems: "center", gap: 4 },
  summaryIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 12, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  tabBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  tabTextActive: { color: "#fff" },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  memberAvatarWrap: { position: "relative" },
  memberAvatar: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  memberInitials: { fontFamily: "Inter_700Bold", fontSize: 15 },
  statusDot: { position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: Colors.bg },
  memberInfo: { flex: 1, gap: 3 },
  memberName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  memberRole: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
  taskProgress: { flexDirection: "row", alignItems: "center", gap: 6 },
  taskBar: { flex: 1, height: 3, backgroundColor: Colors.border, borderRadius: 2, overflow: "hidden" },
  taskBarFill: { height: 3, borderRadius: 2 },
  taskText: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textDim },
  memberActions: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.bgSurface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  projectCard: { backgroundColor: Colors.bgSurface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12, gap: 10 },
  projectHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  projectDot: { width: 10, height: 10, borderRadius: 5 },
  projectName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  projectProgress: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressBar: { flex: 1, height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 5, borderRadius: 3 },
  progressPct: { fontFamily: "Inter_700Bold", fontSize: 13, width: 36, textAlign: "right" },
  projectFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  memberStack: { flexDirection: "row", alignItems: "center" },
  stackAvatar: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: Colors.bgSurface },
  stackDot: { width: 12, height: 12, borderRadius: 6 },
  dueDateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  projectDue: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary },
});
