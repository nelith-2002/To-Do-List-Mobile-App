import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import type { Task } from "../types/task";

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
          <Feather name="arrow-left" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.h1}>Task Details</Text>
        {/* spacer */}
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.title}>{task.title}</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Description</Text>
        <Text style={styles.desc}>{task.description?.trim() || "—"}</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Due date</Text>
        <View style={styles.dueRow}>
          <Feather name="calendar" size={16} color={isOverdue ? "#ef4444" : "#6b7280"} />
          <Text style={[styles.due, isOverdue && styles.dueOverdue]}>{fmt(task.dueAt)}</Text>
          {isOverdue && <Text style={styles.badge}>Overdue</Text>}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddEdit", { task })}
          style={styles.editBtn}
          activeOpacity={0.85}
        >
          <Feather name="edit-2" size={16} color="#fff" />
          <Text style={styles.editTxt}>Edit Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
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
    color: "#0f172a", 
    flex: 1, 
    textAlign: "center" 
  },
  body: { padding: 16, paddingBottom: 24 },
  label: { fontSize: 12, color: "#6b7280", fontWeight: "700", letterSpacing: 0.4 },
  title: { fontSize: 18, fontWeight: "800", color: "#111827", marginTop: 4 },
  desc: { fontSize: 14, color: "#374151", marginTop: 4, lineHeight: 20 },

  dueRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  due: { fontSize: 14, color: "#6b7280" },
  dueOverdue: { color: "#ef4444", fontWeight: "700" },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    color: "#b91c1c",
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#fecaca",
    overflow: "hidden",
  },

  editBtn: {
    marginTop: 24,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  editTxt: { color: "#fff", fontWeight: "700" },
});
