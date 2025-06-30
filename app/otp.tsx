import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";


export default function OTPScreen() {
  const { phone } = useLocalSearchParams();
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otp, setOTP] = useState("");
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState(""); // ✅ Added error state
  const router = useRouter();

  // Function to generate a random 6-digit OTP
  const generateRandomOTP = () => {
    const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(randomOTP);
  };

  // Resend OTP and restart timer
  const resendOtp = () => {
    generateRandomOTP();
    setTimer(30);
    setError(""); // clear error on resend
    setOTP("");
  };

  // Countdown timer
  useEffect(() => {
    generateRandomOTP();
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle OTP verification
  const handleVerify = () => {
    setError("")
    if (otp.length !==6) {
        setError("OTP must 6 digits")
        return;
        
    }
    if (otp === generatedOTP) {
      setError("");
      Alert.alert("Success", "OTP Verified Successfully!");
      router.push({
        pathname: "/account-setup",
        params: { phone },
      });
    } else {
      setError("Invalid OTP. Please try again."); // ✅ Set error message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <Text style={styles.subText}>
        A 6-digit code has been sent to {phone} ({generatedOTP}) {/* Remove in production */}
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={otp}
        onChangeText={(text) => {
          setOTP(text);
          setError("");
        }}
        maxLength={6}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.changeNumberText}>Change Number</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={timer > 0} onPress={resendOtp}>
        <Text
          style={[
            styles.resendText,
            timer > 0 && styles.disabledText
          ]}
        >
          {timer > 0 ? `Resend OTP in ${timer} secs` : "Resend OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937", // gray-900
    marginBottom: 16,
  },
  subText: {
    fontSize: 16,
    color: "#6b7280", // gray-500
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
    padding: 16,
    fontSize: 18,
    borderRadius: 10,
    textAlign: "center",
    width: "75%",
    marginBottom: 10,
  },
  errorText: {
    color: "#ef4444", // red-500
    fontSize: 14,
    marginTop: 4,
    marginBottom: 12,
  },
 verifyButton: {
  backgroundColor: "#1DA851", // WhatsApp verify button green
  padding: 16,
  borderRadius: 9999,
  width: "100%",
  marginTop: 10,
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  changeNumberText: {
    marginTop: 16,
    color: "#3b82f6", // blue-500
    fontSize: 16,
  },
  resendText: {
    color: "#1E90FF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
  disabledText: {
    color: "#A0AEC0", // gray-400
  },
});
