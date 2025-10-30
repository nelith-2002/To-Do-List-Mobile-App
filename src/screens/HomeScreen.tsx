import React, { useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectFiltered, toggleComplete, deleteTask } from "../store/taskSlice";
import TaskCard from "../components/TaskCard";
import { Feather } from "@expo/vector-icons";

type Filter = "all" | "active" | "done";

export default function HomeScreen({ navigation }: any) {
  const [filter, setFilter] = useState<Filter>("all");
  const selectFiltered = useMemo(() => makeSelectFiltered(filter), [filter]);
  const items = useSelector(selectFiltered);
  const dispatch = useDispatch();

  const renderEmpty = () => {
    const map: Record<Filter, { icon: string; title: string; sub: string }> = {
      all:   { icon: "list",       title: "No tasks yet",         sub: "Get started by adding your first task!" },
      active:{ icon: "check-circle",title: "No active tasks",      sub: "All caught up! You have no pending tasks." },
      done:  { icon: "alert-circle",title: "No completed tasks",   sub: "Complete some tasks to see them here." },
    };
    const meta = map[filter];
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIcon}>
          <Feather name={meta.icon as any} size={22} color="#9CA3AF" />
        </View>
        <Text style={styles.emptyTitle}>{meta.title}</Text>
        <Text style={styles.emptySub}>{meta.sub}</Text>
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }: any) => (
      <TaskCard
        task={item}
        onToggle={() => dispatch(toggleComplete(item.id))}
        onEdit={() => navigation.navigate("AddEdit", { task: item })}
        onDelete={() => dispatch(deleteTask(item.id))}
      />
    ),
    [dispatch, navigation]
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.top}>
        <View style={styles.avatar}><Text style={styles.avatarTxt}>N</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.hi}>Hi, Nn!</Text>
          <Text style={styles.sub}>Stay organized, get things done</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("AddEdit")} style={styles.addBtn}>
          <Feather name="plus" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Segmented filters */}
      <View style={styles.segment}>
        {(["all","active","done"] as Filter[]).map(k => (
          <TouchableOpacity key={k} onPress={() => setFilter(k)} style={[styles.segBtn, filter===k && styles.segBtnOn]}>
            <Text style={[styles.segTxt, filter===k && styles.segTxtOn]}>
              {k === "all" ? "All" : k === "active" ? "Active" : "Done"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#fff" 
},
  top: {
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#0f172a", 
    paddingHorizontal: 16, 
    paddingTop: 12, 
    paddingBottom: 14,
    borderBottomLeftRadius: 18, 
    borderBottomRightRadius: 18, 
    gap: 12,
  },
  avatar: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: "#fff", 
    alignItems: "center", 
    justifyContent: "center" 
},
  avatarTxt: { 
    fontWeight: "700", 
    color: "#0f172a" 
},
  hi: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "800" 
},
  sub:{ 
    color: "#c7d2fe", 
    fontSize: 12.8
 },
  addBtn: { 
    backgroundColor: "#fff", 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    alignItems: "center", 
    justifyContent: "center" 
},
  segment: {
    flexDirection: "row", 
    backgroundColor: "#1118270f",
    marginHorizontal: 16, 
    marginTop: 12, 
    borderRadius: 24, 
    padding: 4, 
    gap: 6,
  },
  segBtn: { 
    flex: 1, 
    borderRadius: 20, 
    paddingVertical: 8, 
    alignItems: "center" 
},
  segBtnOn: { 
    backgroundColor: "#fff", 
    shadowColor: "#000", 
    shadowOpacity: 0.08, 
    shadowRadius: 4, 
    elevation: 2 
},
  segTxt: { 
    color: "#111827b0", 
    fontWeight: "600" 
},
  segTxtOn: { 
    color: "#111827" 
},
  emptyWrap: { 
    alignItems: "center", 
    marginTop: 80, 
    paddingHorizontal: 24 
},
  emptyIcon: {
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    borderWidth: 2, 
    borderColor: "#E5E7EB",
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 12,
  },
  emptyTitle: { 
    fontWeight: "700", 
    color: "#374151", 
    marginBottom: 4 
},
  emptySub: { 
    color: "#6b7280", 
    textAlign: "center" 
},
});
