import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/images/WhatsApp_icon.png')}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to ChatApp!</Text>

      <Text style={styles.description}>
        Read our{' '}
        <Text style={styles.link}>privacy policy</Text>. Tap agree & continue to
        accept the{' '}
        <Text style={styles.link}>terms and conditions</Text>.
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Agree</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 112,
    height: 112,
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  link: {
    color: '#3b82f6', // Tailwind blue-500 equivalent
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#22c55e', // Tailwind green-500 equivalent
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 9999,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
