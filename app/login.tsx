import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function PhoneInput() {
  const [rawNumber, setRawNumber] = useState(""); // Digits only
  const [error, setError] = useState("");

  // Format: +94 XX XXX XXXX
  const formatNumber = (digits: string) => {
    const part1 = digits.slice(0, 2); // first 2 digits after +94
    const part2 = digits.slice(2, 5); // next 3 digits
    const part3 = digits.slice(5, 9); // last 4 digits
    let formatted = "+94";

    if (part1) formatted += " " + part1;
    if (part2) formatted += " " + part2;
    if (part3) formatted += " " + part3;

    return formatted;
  };

  // Handle user input
  const handleChange = (text: string) => {
    let digits = text.replace(/\D/g, ""); // remove non-digits

    if (digits.startsWith("94")) {
      digits = digits.slice(2);
    } else if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    if (digits.length > 9) digits = digits.slice(0, 9);
    setRawNumber(digits);
    setError("");
  };

  const isValid = rawNumber.length === 9;

  // Combined handler for validation and navigation
  const handleNext = () => {
    if (!isValid) {
      setError("Please enter a valid 9-digit phone number");
      Alert.alert("Invalid number", "Enter a valid Phone Number");
      return;
    }

    const formattedPhone = formatNumber(rawNumber);
    router.push({
      pathname: "/otp",
      params: { phone: formattedPhone },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your phone number</Text>
      <Text style={styles.subtext}>
        WhatsApp will send an SMS to verify your number.
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="+94 71 781 2345"
        value={formatNumber(rawNumber)}
        onChangeText={handleChange}
        maxLength={16}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        disabled={!isValid}
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    fontSize: 18,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 15,
    borderRadius: 999,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
