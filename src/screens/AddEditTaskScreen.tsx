import { useMemo , useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform , Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../store/taskSlice";
import type { Task } from "../types/task";

type Props = {
    navigation: any;
    route:{
        params?: { task?: Task }
    }
}

export default function AddEditTaskScreen({ navigation, route }: Props) {
    const dispatch = useDispatch();
    const editing = !!route.params?.task;
    const [title, setTitle] = useState(route.params?.task?.title ?? "");
    const [description, setDescription] = useState(route.params?.task?.description ?? "");
    const [dueAt, setDueAt] = useState<Date>(route.params?.task ? new Date(route.params.task.dueAt) : new Date());
    const [showPicker, setShowPicker] = useState(false);

    const canSave = useMemo(() => title.trim().length > 0, [title]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const save = () => {
    if (!canSave) return;

    const picked = new Date(dueAt);
    picked.setHours(0, 0, 0, 0);
    if (picked < today) {
      Alert.alert("Invalid due date", "Due date can’t be before today.");
      return;
    }

    const iso = dueAt.toISOString();

    if (editing && route.params?.task) {
      dispatch(
        updateTask({ 
            id: route.params.task.id, 
            changes: { 
                title: title.trim(),
                description: description.trim(), 
                dueAt: iso 
            } 
        })
    );
    } else {
      dispatch(
        addTask({ 
            title: title.trim(), 
            description: description.trim(), 
            dueAt: iso 
        })
    );
    }
    navigation.goBack();
  };

  return(
    <SafeAreaView style={styles.safe}>
       <View style={styles.warp} >
         <Text style={styles.h1}>{editing ? "Edit Task" : "Add Task"}</Text>
         
        <Text style={styles.label}>Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
          style={[styles.input, !canSave && title.length > 0 && styles.inputErr]}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Optional"
          style={[styles.input, { height: 90 }]}
          multiline
        />

        <Text style={styles.label}>Due date</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)} activeOpacity={0.8}>
          <Text>{dueAt.toDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dueAt}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            minimumDate={today}
            onChange={(_, date) => {
              setShowPicker(Platform.OS === "ios");
              if (date) setDueAt(date);
            }}
          />
        )}

        <TouchableOpacity 
            style={[styles.cta, !canSave && styles.ctaDisabled]} 
            disabled={!canSave} 
            onPress={save}
        >
          <Text style={styles.ctaText}>{editing ? "Save Changes" : "Add Task"}</Text>
        </TouchableOpacity>

       </View>
    </SafeAreaView>
    
  )

  

}

const styles = StyleSheet.create({
     safe:{
      flex: 1,
      backgroundColor: "#fff"
     },
     warp:{
      flex: 1,
      padding: 20,
      gap: 10,
     },
     h1:{
      fontSize: 20, 
      fontWeight: "700", 
      marginBottom: 6, 
      color: "#0B132B"
     },
     label:{
      fontSize: 13,
      fontWeight: "600",
      color: "#111827",
     },
     input:{
      backgroundColor: "#fff",
      borderWidth: 1, 
      borderColor: "#E5E7EB",
      borderRadius: 12, 
      paddingHorizontal: 12, 
      paddingVertical: 12,
     },
     inputErr:{
      borderColor: "#ef4444"  
     },
     cta:{
      marginTop: "auto",
      backgroundColor: "#0f172a",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center"
     },
     ctaDisabled:{
      backgroundColor: "#94a3b8"
     },
     ctaText:{
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
     }
  })
