import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

type Message = {
  _id: string;
  text: string;
  senderId: string;
  createdAt: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();

  // Example participant (chat with Alex)
  const participant = {
    _id: 'user-2',
    name: 'Alex',
    profileImage: 'https://randomuser.me/api/portraits/men/10.jpg',
  };

  // Messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      _id: 'msg-1',
      text: 'Hello! Welcome to chat ' + chatId,
      senderId: 'user-2',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'msg-2',
      text: 'Hi! How can I help you?',
      senderId: 'user-1',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const currentUserId = 'user-1';

  // Send message handler
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      _id: Math.random().toString(),
      text: inputText.trim(),
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [newMessage, ...prev]); // prepend for inverted FlatList
    setInputText('');
  };

  // Render each message
  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Text style={[styles.messageText, isCurrentUser && { color: '#fff' }]}>
          {item.text}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
       {/* Back Button */}
  <TouchableOpacity onPress={() => router.push('/Chat-list')} style={styles.iconButton}>
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>

  {/* Participant Info */}
  <View style={styles.participantInfo}>
    <Image source={{ uri: participant.profileImage }} style={styles.profileImage} />
    <Text style={styles.headerTitle}>{participant.name}</Text>
  </View>

  {/* Right icons */}
  <View style={styles.rightIcons}>
    <TouchableOpacity onPress={() => alert('Video call pressed')} style={styles.iconButton}>
      <MaterialIcons name="videocam" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => alert('Call pressed')} style={styles.iconButton}>
      <Ionicons name="call" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => alert('More options pressed')} style={styles.iconButton}>
      <Entypo name="dots-three-vertical" size={20} color="#fff" />
    </TouchableOpacity>
        </View>
      </View>

      {/* Messages list */}
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted // newest messages at bottom
      />

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={inputText}
          onChangeText={setInputText}
          multiline={true}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#075E54',
    justifyContent: 'space-between',
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  messagesList: {
    padding: 10,
    paddingBottom: 20,
  },

  messageContainer: {
    maxWidth: '70%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  messageLeft: {
    backgroundColor: '#ececec',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#25D366',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#075E54',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
