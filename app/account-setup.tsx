import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountSetupScreen() {
  const { phone: userPhone } = useLocalSearchParams();
  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name before proceeding");
      return;
    }

    try {
      setLoading(true);

      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          name,
          phone: userPhone,
          profileImage,
        })
      );

      router.push("/Chat-list");
    } catch (error) {
      console.error("Error saving profile locally:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your Profile</Text>

      <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
        {profileImage ? (
          <Image style={styles.image} source={{ uri: profileImage }} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={saveProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save & Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1f2937",
  },
  imageWrapper: {
    marginBottom: 20,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ccc",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    fontSize: 18,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 999,
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#86efac",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
