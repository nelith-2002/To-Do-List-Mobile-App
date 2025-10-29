import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Feather } from "@expo/vector-icons";

type Props = { navigation: any };

const isValidName = (s: string) => s.trim().length >= 2;
const isLikelyUrl = (s: string) =>
  /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(s.trim());

export default function ProfileSetupScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [imgUri, setImgUri] = useState<string | undefined>(undefined);
  const [urlInput, setUrlInput] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = useMemo(() => isValidName(name), [name]);

  const pickImage = useCallback(async () => {
    // 1) Explain why we need access
    Alert.alert(
      "Allow Photo Access?",
      "We need permission to open your gallery so you can choose and crop a profile photo. This is optional.",
      [
        { text: "Not now", style: "cancel" },
        {
          text: "Allow",
          onPress: async () => {
            try {
              // 2) Ask permission only after user agrees in the alert
              const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (perm.status !== "granted") {
                // If permanently denied, offer to open settings
                if (perm.canAskAgain === false) {
                  Alert.alert(
                    "Permission blocked",
                    "Photo access is blocked in system settings. You can enable it to pick an image.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Open Settings",
                        onPress: () => Linking.openSettings(),
                      },
                    ]
                  );
                } else {
                  setError(
                    "Permission denied. Please allow photo access to pick an image."
                  );
                }
                return;
              }

              setError(null);

              // 3) Launch picker (with cropping)
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.9,
              });

              if (!result.canceled && result.assets?.[0]?.uri) {
                setImgUri(result.assets[0].uri);
              }
            } catch (e) {
              setError("Something went wrong while opening your gallery.");
            }
          },
        },
      ]
    );
  }, []);

  const applyUrl = useCallback(async () => {
    setError(null);
    const u = urlInput.trim();
    if (!isLikelyUrl(u)) {
      setError("Please paste a valid image URL (PNG/JPG/GIF/WebP/SVG).");
      return;
    }
    try {
      setLoadingImg(true);
      // Let RN Image attempt to render; prefetch is optional and can be flaky due to CORS.
      setImgUri(u);
    } catch {
      setError("Could not load image from URL.");
    } finally {
      setLoadingImg(false);
    }
  }, [urlInput]);

  const onContinue = useCallback(() => {
    if (!canContinue) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }
    navigation.replace("Home", {
      profile: { name: name.trim(), photo: imgUri },
    });
  }, [canContinue, imgUri, name, navigation]);

  const nameInvalid = !isValidName(name) && name.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "right", "left"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>Let’s set up your profile</Text>
          </View>

          {/* Global error banner */}
          {error ? (
            <View style={styles.errorBanner}>
              <Feather name="alert-triangle" size={16} color="#fff" />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {imgUri ? (
                <Image source={{ uri: imgUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person-outline" size={36} color="#111827" />
                </View>
              )}
              <View style={styles.camBadge}>
                <Feather name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.hintText}>Upload your photo (optional)</Text>
          </View>

          {/* Image URL field */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Or paste image URL</Text>
            <View style={styles.urlRow}>
              <Feather
                name="link"
                size={16}
                color="#6b7280"
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder="https://example.com/photo.jpg"
                value={urlInput}
                onChangeText={(t) => {
                  setUrlInput(t);
                  // Clear banner when typing again
                  if (error) setError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                style={styles.urlInput}
              />
              <TouchableOpacity
                onPress={applyUrl}
                style={[
                  styles.applyBtn,
                  urlInput.trim().length === 0 && { opacity: 0.5 },
                ]}
                disabled={urlInput.trim().length === 0}
              >
                {loadingImg ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.applyText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Name field */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (error) setError(null);
              }}
              style={[styles.input, nameInvalid ? styles.inputError : null]}
              returnKeyType="done"
            />
            {nameInvalid ? (
              <Text style={styles.inlineError}>
                Name must be at least 2 characters.
              </Text>
            ) : null}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.cta, !canContinue && styles.ctaDisabled]}
            onPress={onContinue}
            disabled={!canContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: "flex-start",
  },
  header: { alignItems: "center", marginTop: 12, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", color: "#0B132B" },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 4 },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  errorBannerText: { color: "#fff", fontSize: 13, flexShrink: 1 },

  avatarWrap: { alignItems: "center", marginTop: 10, marginBottom: 8 },
  avatarButton: { position: "relative" },
  avatar: { width: 108, height: 108, borderRadius: 54, backgroundColor: "#E5E7EB" },
  avatarPlaceholder: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  camBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  hintText: { fontSize: 12, color: "#6b7280", marginTop: 8 },

  fieldBlock: { marginTop: 14 },
  label: { fontSize: 13, color: "#111827", marginBottom: 8, fontWeight: "600" },

  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  urlInput: { flex: 1, fontSize: 14, color: "#111827" },
  applyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    marginLeft: 8,
  },
  applyText: { fontSize: 12, fontWeight: "600", color: "#111827" },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  inputError: { borderColor: "#ef4444" },
  inlineError: { color: "#ef4444", fontSize: 12, marginTop: 6 },

  cta: {
    marginTop: "auto",
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaDisabled: {
    backgroundColor: "#94a3b8",
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
