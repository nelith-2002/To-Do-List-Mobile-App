import { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Task } from "../types/task";
import { Feather } from "@expo/vector-icons";

type Props ={
    task: Task;
    onToggle(): void;
    onEdit(): void;
    onDelete(): void;
    onOpenDetails(): void;
}

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};


export default function TaskCard({ task, onToggle, onEdit, onDelete , onOpenDetails}: Props) {
  // compute once per render
  const { isOverdue, dueLabel } = useMemo(() => {
    const due = new Date(task.dueAt);
    const today = startOfDay(new Date());
    const overdue = startOfDay(due) < today && !task.completed;
    const label =
      isNaN(due.getTime()) ? "—" : due.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

    return { isOverdue: overdue, dueLabel: label };
  }, [task.dueAt, task.completed]);

  return (
    <View style={styles.card}>
      {/* Left: checkbox */}
      <TouchableOpacity onPress={onToggle} style={styles.check} activeOpacity={0.7}>
        {task.completed ? (
          <Feather name="check-circle" size={22} color="#10b981" />
        ) : (
          <Feather name="circle" size={22} color="#9CA3AF" />
        )}
      </TouchableOpacity>

      {/* Middle: title/desc */}
      <TouchableOpacity style={styles.mid} activeOpacity={0.8} onPress={onOpenDetails}>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        {!!task.description && (
          <Text style={[styles.desc, task.completed && styles.descDone]} numberOfLines={2}>
            {task.description}
          </Text>
        )}

       
        <View style={styles.metaRow}>
          <Feather name="calendar" size={14} color={isOverdue ? "#ef4444" : "#6b7280"} />
          <Text style={[styles.due, isOverdue && styles.dueOverdue]}>{dueLabel}</Text>
          {isOverdue && <Text style={styles.badge}>Overdue</Text>}
        </View>
      </TouchableOpacity>

      
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.iconBtn} hitSlop={8}>
          <Feather name="edit-2" size={18} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.iconBtn, { marginLeft: 8 }]} hitSlop={8}>
          <Feather name="trash-2" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  check: { 
    paddingRight: 10, 
    paddingTop: 2 
  },
  mid: { 
    flex: 1 
  },
  title: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#111827" 
  },
  titleDone: { 
    textDecorationLine: "line-through", 
    color: "#9CA3AF" 
  },
  desc: { 
    marginTop: 4, 
    fontSize: 13, 
    color: "#4b5563" 
  },
  descDone: { 
    color: "#9CA3AF" 
  },
  metaRow: { 
    marginTop: 8, 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6 
  },
  due: { 
    marginLeft: 6, 
    fontSize: 12.5, 
    color: "#6b7280" 
  },
  dueOverdue: { 
    color: "#ef4444", 
    fontWeight: "700" 
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 13,
    overflow: "hidden",
    color: "#b91c1c",
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  actions: { 
    flexDirection: "row", 
    marginLeft: 8, 
    alignSelf: "center" 
  },
  iconBtn: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
})