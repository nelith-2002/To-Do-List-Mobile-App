import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import type { Task } from "../types/task";
import { COLORS, PALETTE } from "../theme/colors";

type Props = {
  navigation: any;
  route: { params: { task: Task } };
};

const fmt = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

export default function TaskDetailsScreen({ navigation, route }: Props) {
  const { task } = route.params;

  const isOverdue = (() => {
    const d = new Date(task.dueAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueStart = new Date(d);
    dueStart.setHours(0, 0, 0, 0);
    return !task.completed && dueStart < today;
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.h1}>Task Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.title}>{task.title}</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Description</Text>
        <Text style={styles.desc}>{task.description?.trim() || "—"}</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Due date</Text>
        <View style={styles.dueRow}>
          <Feather name="calendar" size={16} color={isOverdue ? COLORS.danger : COLORS.textMuted} />
          <Text style={[styles.due, isOverdue && styles.dueOverdue]}>{fmt(task.dueAt)}</Text>
          {isOverdue && <Text style={styles.badge}>Overdue</Text>}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddEdit", { task })}
          style={styles.editBtn}
          activeOpacity={0.85}
        >
          <Feather name="edit-2" size={16} color={COLORS.textOnDark} />
          <Text style={styles.editTxt}>Edit Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.appBg 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  h1: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: COLORS.primary, 
    flex: 1, 
    textAlign: "center" 
  },
  body: { 
    padding: 16, 
    paddingBottom: 24 
  },
  label: { 
    fontSize: 12, 
    color: "#6b7280", 
    fontWeight: "700", 
    letterSpacing: 0.4 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: COLORS.textPrimary, 
    marginTop: 4 
  },
  desc: { 
    fontSize: 14, 
    color: PALETTE.slate700, 
    marginTop: 4, 
    lineHeight: 20 
  },
  dueRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8, 
    marginTop: 4 
  },
  due: { 
    fontSize: 14, 
    color: COLORS.textMuted 
  },
  dueOverdue: { 
    color: COLORS.danger, 
    fontWeight: "700" 
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    color: COLORS.dangerDark,
    backgroundColor: COLORS.badgeDangerBg,
    borderWidth: 1,
    borderColor: COLORS.badgeDangerBorder,
    overflow: "hidden",
  },

  editBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  editTxt: { 
    color: COLORS.textOnDark, 
    fontWeight: "700" 
  },
});
