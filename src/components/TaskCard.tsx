import { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Task } from "../types/task";
import { Feather } from "@expo/vector-icons";

type Props ={
    task: Task;
    onToggle(): void;
    onEdit(): void;
    onDelete(): void;
}

export default memo(function TaskCard({task, onToggle, onEdit, onDelete}: Props){
    const due = new Date(task.dueAt)
    const dueStr = due.toLocaleDateString();

    return(
        <View style={styles.card} >
            <TouchableOpacity style={styles.left} onPress={onToggle} activeOpacity={0.7}>
                <View style={[styles.checkbox, task.completed && styles.checkboxOn]} >
                    {task.completed && <Feather name="check" size={14} color="#fff" />}
                </View>
            </TouchableOpacity>

            <View style={styles.center} >
               <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={1}>
          {task.title}
        </Text>
        {!!task.description && (
          <Text style={styles.desc} numberOfLines={2}>{task.description}</Text>
        )}
        <Text style={styles.meta}>Due: {dueStr}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
          <Feather name="edit-3" size={18} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
          <Feather name="trash-2" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
            
    </View>
    )


} )

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1, borderColor: "#E5E7EB",
    alignItems: "center",
    marginBottom: 10,
  },
  left:{
     paddingRight: 10,
  },
  checkbox:{
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: "#CBD5E1",
    alignItems: "center", justifyContent: "center", backgroundColor: "#fff",
  },
  checkboxOn:{
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  center:{
    flex: 1,
  },
  title:{
    fontSize: 16,
    fontWeight: "600",
    color: "#0B132B"
  },
  titleDone:{
    textDecorationColor: "line-through",
    color: "#6b7280"
  },
  meta:{
    fontSize: 14,
    color: "#64748b",
    marginTop: 4
  },
  desc:{
    fontSize: 12.8,
    color: "#64748b",
    marginTop: 4
  },
  iconBtn:{
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6"
  },
  right:{
    flexDirection: "row",
    gap: 8,
    marginLeft: 8,
  }
})