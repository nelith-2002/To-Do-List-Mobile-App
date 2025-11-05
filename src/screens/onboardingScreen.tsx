import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

export default function OnboardingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Ionicons name="list-outline" size={32} color={COLORS.textOnDark} />
          </View>
          <Text style={styles.title}>TaskFlow</Text>
          <Text style={styles.subtitle}>Your Personal Task Manager</Text>
        </View>

        {/* Main image */}
        <Image
          source={require("../../assets/Images/onboard_img.png")}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <MaterialIcons name="assignment" size={40} color={COLORS.textPrimary} />
            <Text style={styles.featureText}>Organize all your tasks</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="event-available" size={40} color={COLORS.textPrimary} />
            <Text style={styles.featureText}>Never miss a deadline</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome5 name="chart-line" size={40} color={COLORS.textPrimary} />
            <Text style={styles.featureText}>Track your progress</Text>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ProfileSetup")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBg,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  topSection: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 14,
  },
  logoBox: {
    backgroundColor: COLORS.accentNavy,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtleGray,
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 15,
  },
  features: {
    width: "100%",
    marginTop: 30,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    paddingTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.textOnDark,
    fontWeight: "600",
    fontSize: 16,
  },
});
