import React, { useMemo, useState, useCallback  , useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList , Modal , Pressable , Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectFiltered, toggleComplete, deleteTask } from "../store/taskSlice";
import TaskCard from "../components/TaskCard";
import { Feather } from "@expo/vector-icons";
import type { Task } from "../types/task";
import AsyncStorage from "@react-native-async-storage/async-storage";


type Filter = "all" | "active" | "done";
type DateFilter = "any" | "today" | "week" | "month" | "overdue";
type Profile = { name: string; photo?: string };

const PROFILE_KEY = "@taskflow/profile";

export default function HomeScreen({ navigation , route }: any) {
  const [filter, setFilter] = useState<Filter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  // persist helper
  const saveProfile = async (p: Profile) => {
    try { await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch {}
  };

  // Load profile once on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (raw) setProfile(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  
  useEffect(() => {
    const p = route?.params?.profile as Profile | undefined;
    if (p?.name) {
      setProfile(p);
      saveProfile(p);
    }
  }, [route?.params?.profile]);

  const greetingName = React.useMemo(() => {
    if (!profile?.name) return "Nn";
    const parts = profile.name.trim().split(/\s+/);
    const first = parts[0] ?? "";
    return first.length >= 2 ? first : profile.name.trim();
  }, [profile?.name]);

  const avatarLetter = React.useMemo(() => {
    const n = profile?.name?.trim();
    return n && n.length > 0 ? n.charAt(0).toUpperCase() : "A";
  }, [profile?.name]);

  const activeCount = useSelector((s: any) =>
    s.tasks.items.reduce((acc: number, t: Task) => acc + (t.completed ? 0 : 1), 0)
  );

  const selectFiltered = useMemo(() => makeSelectFiltered(filter), [filter]);
  const baseItems = useSelector(selectFiltered);
  const dispatch = useDispatch();

  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const endOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };
  const isSameDay = (a: Date, b: Date) =>
    startOfDay(a).getTime() === startOfDay(b).getTime();

  const isInThisWeek = (d: Date) => {
    const now = new Date();
    const day = now.getDay(); // 0 Sun .. 6 Sat
    // treat week as Mon-Sun
    const diffToMon = (day + 6) % 7; // 0 when Monday
    const monday = startOfDay(new Date(now));
    monday.setDate(now.getDate() - diffToMon);
    const sunday = endOfDay(new Date(monday));
    sunday.setDate(monday.getDate() + 6);
    return d >= monday && d <= sunday;
  };

  const isInThisMonth = (d: Date) => {
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  };

  // Apply additional date filter on top of status filter
  const items: Task[] = useMemo(() => {
    if (dateFilter === "any") return baseItems;
    const today = new Date();
    const todayStart = startOfDay(today);
    switch (dateFilter) {
      case "today":
        return baseItems.filter((t) => isSameDay(new Date(t.dueAt), today));
      case "week":
        return baseItems.filter((t) => isInThisWeek(new Date(t.dueAt)));
      case "month":
        return baseItems.filter((t) => isInThisMonth(new Date(t.dueAt)));
      case "overdue":
        return baseItems.filter((t) => startOfDay(new Date(t.dueAt)) < todayStart && !t.completed);
      default:
        return baseItems;
    }
  }, [baseItems, dateFilter]);

  const hasAnyTask = baseItems.length > 0;

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
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        onToggle={() => dispatch(toggleComplete(item.id))}
        onEdit={() => navigation.navigate("AddEdit", { task: item })}
        onDelete={() => dispatch(deleteTask(item.id))}
        onOpenDetails={() => navigation.navigate("TaskDetails", { task: item })}
      />
    ),
    [dispatch, navigation]
  );

  const onLogout = useCallback(async () => {
    try { await AsyncStorage.removeItem(PROFILE_KEY); } catch {}
    setShowAccountMenu(false);
    // send user to profile setup; replace to avoid back nav to Home
    navigation.replace("ProfileSetup");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.top}>
         <TouchableOpacity
          style={styles.avatar}
          activeOpacity={0.8}
          onPress={() => setShowAccountMenu(true)}
        >
          {profile?.photo ? (
            <Image source={{ uri: profile.photo }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarTxt}>{avatarLetter}</Text>
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.hi}>Hi, {greetingName}!</Text>
          <Text style={styles.sub}>Stay organized, get things done</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.iconAction, !hasAnyTask && { opacity: 0.45 }]}
            disabled={!hasAnyTask}
            onPress={() => setShowDateSheet(true)}
          >
            <Feather name="filter" size={20} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddEdit")}
            style={[styles.iconAction, { marginLeft: 8 }]}
          >
            <Feather name="plus" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented filters */}
      <View style={styles.segment}>
        {(["all","active","done"] as Filter[]).map(k => (
          <TouchableOpacity
            key={k}
            onPress={() => setFilter(k)}
            style={[styles.segBtn, filter===k && styles.segBtnOn]}
          >
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

      {/* Date filter modal */}
      <Modal
        visible={showDateSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateSheet(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setShowDateSheet(false)}>
          <View />
        </Pressable>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Filter by due date</Text>

          {([
            { key: "any",     label: "Any date" },
            { key: "today",   label: "Today" },
            { key: "week",    label: "This week" },
            { key: "month",   label: "This month" },
            { key: "overdue", label: "Overdue" },
          ] as { key: DateFilter; label: string }[]).map((opt) => {
            const active = dateFilter === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sheetRow, active && styles.sheetRowActive]}
                onPress={() => {
                  setDateFilter(opt.key);
                  setShowDateSheet(false);
                }}
              >
                <Text style={[styles.sheetRowText, active && styles.sheetRowTextActive]}>
                  {opt.label}
                </Text>
                {active && <Feather name="check" size={18} color="#0f172a" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>

      <Modal
        visible={showAccountMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountMenu(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setShowAccountMenu(false)}>
          <View />
        </Pressable>

        <View style={styles.accountMenu}>
          <Text style={styles.menuHeader}>My Account</Text>

          <View style={styles.menuRow}>
            <View style={[styles.menuAvatar, profile?.photo ? undefined : styles.menuAvatarFallback]}>
              {profile?.photo ? (
                <Image source={{ uri: profile.photo }} style={styles.menuAvatarImg} />
              ) : (
                <Text style={styles.menuAvatarTxt}>{avatarLetter}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuName}>{profile?.name || "NN"}</Text>
              <Text style={styles.menuSub}>{activeCount} active {activeCount === 1 ? "task" : "tasks"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.logoutRow} onPress={onLogout} activeOpacity={0.8}>
            <Feather name="log-out" size={16} color="#b91c1c" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
    justifyContent: "center",
    overflow: "hidden", 
},
  avatarImg: {
    width: "100%", 
    height: "100%", 
    borderRadius: 17,

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
 actionsRow:{
    flexDirection: "row",
    alignItems: "center",
 },
 iconAction:{
    backgroundColor: "#fff",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
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
sheetBackdrop:{
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
},
sheet:{
  position: "absolute",
    right: 12,
    top: 74,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
},
sheetTitle: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 6,
    opacity: 0.7,
  },
  sheetRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetRowActive: {
    backgroundColor: "#f4f6f9",
  },
  sheetRowText: { 
    color: "#111827", 
    fontSize: 14 
  },
  sheetRowTextActive: { 
    color: "#0f172a", 
    fontWeight: "700" 
  },
  accountMenu: {
    position: "absolute",
    left: 12,               
    top: 74,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 220,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  menuHeader: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 6,
    opacity: 0.7,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  menuAvatar: { width: 36, height: 36, borderRadius: 18, overflow: "hidden" },
  menuAvatarFallback: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  menuAvatarImg: { width: "100%", height: "100%", borderRadius: 18 },
  menuAvatarTxt: { fontWeight: "700", color: "#111827" },
  menuName: { fontWeight: "700", color: "#111827" },
  menuSub: { color: "#6b7280", fontSize: 12 },

  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6 },

  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  logoutText: { color: "#b91c1c", fontWeight: "700" },

});
