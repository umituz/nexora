import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const CATEGORIES = ["All", "AI", "Tech", "Finance", "Business"];

function ArticleCard({ article, index, onSave }: { article: any; index: number; onSave: () => void }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <Pressable
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={[styles.articleCard, index === 0 && styles.featuredCard]}
      >
        {index === 0 && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}
        <View style={styles.articleMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: article.color + "20" }]}>
            <Text style={[styles.categoryText, { color: article.color }]}>{article.category}</Text>
          </View>
          <Text style={styles.articleTime}>{article.time}</Text>
        </View>
        <Text style={[styles.articleTitle, index === 0 && styles.featuredTitle]}>{article.title}</Text>
        <Text style={styles.articleSummary} numberOfLines={index === 0 ? 3 : 2}>{article.summary}</Text>
        <View style={styles.articleFooter}>
          <View style={styles.sourceRow}>
            <View style={[styles.sourceDot, { backgroundColor: article.color }]} />
            <Text style={styles.sourceText}>{article.source}</Text>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.readInfo}>
              <Ionicons name="time-outline" size={11} color={Colors.textDim} />
              <Text style={styles.readTime}>{article.readTime}</Text>
            </View>
            <Pressable onPress={(e) => { e.stopPropagation(); onSave(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
              <Ionicons name={article.saved ? "bookmark" : "bookmark-outline"} size={16} color={article.saved ? Colors.accent : Colors.textDim} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { news, toggleNewsItem } = useApp();
  const [category, setCategory] = useState("All");

  const filtered = news.filter((a) => category === "All" || a.category === category);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>News</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(a) => a.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={styles.catScroll}>
            {CATEGORIES.map((c) => (
              <Pressable key={c} onPress={() => { Haptics.selectionAsync(); setCategory(c); }} style={[styles.catBtn, category === c && styles.catBtnActive]}>
                <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        }
        renderItem={({ item, index }) => <ArticleCard article={item} index={index} onSave={() => toggleNewsItem(item.id)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  catScroll: { flexDirection: "row", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  catBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  catBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  catText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  catTextActive: { color: "#fff" },
  articleCard: { backgroundColor: Colors.bgSurface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12, gap: 8 },
  featuredCard: { borderColor: Colors.accent + "40", backgroundColor: Colors.accentGlow },
  featuredBadge: { alignSelf: "flex-start", backgroundColor: Colors.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  featuredText: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#fff", letterSpacing: 0.5 },
  articleMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  categoryText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  articleTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textDim },
  articleTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text, lineHeight: 21 },
  featuredTitle: { fontSize: 17 },
  articleSummary: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  articleFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sourceRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sourceDot: { width: 6, height: 6, borderRadius: 3 },
  sourceText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.textSecondary },
  footerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  readInfo: { flexDirection: "row", alignItems: "center", gap: 3 },
  readTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textDim },
});
