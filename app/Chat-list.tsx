import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

// Import icons from @expo/vector-icons
import { MaterialIcons, Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';

type Participant = {
  _id: string;
  name: string;
  profileImage?: any; // number for require() or string URL
};

type Message = {
  text: string;
  createdAt: string;
};

type Chat = {
  _id: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
};

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const router = useRouter();

  // Local images required here


  useEffect(() => {
    const timeout = setTimeout(() => {
      const mockUser = { _id: 'user-1', name: 'Me' };
      setCurrentUser(mockUser);

      const mockChats: Chat[] = [
        {
          _id: 'chat-1',
          participants: [
            mockUser,
            { _id: 'user-2', name: 'Alex', profileImage: 'https://randomuser.me/api/portraits/men/10.jpg' },
          ],
          lastMessage: { text: 'Hey, what’s up?', createdAt: new Date().toISOString() },
          unreadCount: 2,
        },
        {
          _id: 'chat-2',
          participants: [
            mockUser,
            { _id: 'user-3', name: 'Roman', profileImage: 'https://randomuser.me/api/portraits/men/15.jpg' },
          ],
          lastMessage: { text: 'See you tomorrow.', createdAt: new Date().toISOString() },
          unreadCount: 0,
        },
        {
          _id: 'chat-3',
          participants: [
            mockUser,
            { _id: 'user-4', name: 'Bob', profileImage: 'https://randomuser.me/api/portraits/men/40.jpg' },
          ],
          lastMessage: { text: 'Can you call me?', createdAt: new Date().toISOString() },
          unreadCount: 4,
        },
        {
          _id: 'chat-4',
          participants: [
            mockUser,
            { _id: 'user-5', name: 'Stone', profileImage: 'https://randomuser.me/api/portraits/men/70.jpg' },
          ],
          lastMessage: { text: 'Let’s meet at 5.', createdAt: new Date().toISOString() },
          unreadCount: 1,
        },
        {
          _id: 'chat-5',
          participants: [
            mockUser,
            { _id: 'user-6', name: 'Ema', profileImage: 'https://randomuser.me/api/portraits/women/25.jpg' },
          ],
          lastMessage: { text: 'Thanks for your help!', createdAt: new Date().toISOString() },
          unreadCount: 0,
        },
        {
          _id: 'chat-6',
          participants: [
            mockUser,
            { _id: 'user-7', name: 'Liam', profileImage: 'https://randomuser.me/api/portraits/men/85.jpg' },
          ],
          lastMessage: { text: 'Are you coming?', createdAt: new Date().toISOString() },
          unreadCount: 3,
        },
        {
          _id: 'chat-7',
          participants: [
            mockUser,
            { _id: 'user-8', name: 'Sophia', profileImage: 'https://randomuser.me/api/portraits/women/44.jpg' },
          ],
          lastMessage: { text: 'Great job on the project!', createdAt: new Date().toISOString() },
          unreadCount: 0,
        },
        {
          _id: 'chat-8',
          participants: [
            mockUser,
            { _id: 'user-9', name: 'Noah', profileImage: 'https://randomuser.me/api/portraits/men/90.jpg' },
          ],
          lastMessage: { text: 'Let’s catch up soon.', createdAt: new Date().toISOString() },
          unreadCount: 1,
        },
      ];

      setChats(mockChats);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const renderItem = ({ item }: { item: Chat }) => {
    const otherParticipant = item.participants.find(p => p._id !== currentUser?._id);

    return (
      <TouchableOpacity
        // style={styles.chatItem}
        // onPress={() => router.push(`/chat/${item._id}`)}
      >
        <Image
          source={
            typeof otherParticipant?.profileImage === 'number'
              ? otherParticipant.profileImage
              : { uri: otherParticipant?.profileImage || 'https://placekitten.com/100/100' }
          }
          style={styles.profileImage}
        />

        <View style={styles.chatContent}>
          <Text style={styles.chatName}>{otherParticipant?.name || 'Unknown'}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.text || 'No messages yet'}
          </Text>
        </View>

        <View style={styles.chatMeta}>
          <Text style={styles.time}>
            {item.lastMessage?.createdAt
              ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat App</Text>
      </View>

      {/* Top Tabs */}
      <View style={styles.topTabs}>
        <Text style={styles.tab}>All</Text>
        <Text style={styles.tab}>
          Unread <Text style={styles.badgeText}>37</Text>
        </Text>
        <Text style={styles.tab}>Favourites</Text>
        <Text style={styles.tab}>Group</Text>
        <Text style={styles.tab}>+</Text>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats yet</Text>
            <TouchableOpacity
              style={styles.startChatButton}
              onPress={() => router.push('/new-chat')}
            >
              <Text style={styles.startChatText}>Start a new chat</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating New Chat Button */}
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() => router.push('/new-chat')}
      >
        <Text style={styles.newChatText}>+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomTabContainer}>
          <MaterialIcons name="chat" size={24} color="#075E54" />
          <Text style={styles.bottomTab}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabContainer}>
          <Ionicons name="notifications" size={24} color="#075E54" />
          <Text style={styles.bottomTab}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabContainer}>
          <FontAwesome5 name="users" size={24} color="#075E54" />
          <Text style={styles.bottomTab}>Communities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabContainer}>
          <Entypo name="phone" size={24} color="#075E54" />
          <Text style={styles.bottomTab}>Calls</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: '#075E54',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  topTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  tab: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#075E54',
  },
  badgeText: {
    color: '#d32f2f',
  },

  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  chatContent: { flex: 1 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  lastMessage: { fontSize: 14, color: '#777' },
  chatMeta: { alignItems: 'flex-end', minWidth: 60 },
  time: { fontSize: 12, color: '#777', marginBottom: 5 },
  unreadBadge: {
    backgroundColor: '#075E54',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  listContent: { paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 18, color: '#777', marginBottom: 20 },
  startChatButton: {
    backgroundColor: '#075E54',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  startChatText: { color: '#fff', fontSize: 16, fontWeight: '500' },

  newChatButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#25D366',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  newChatText: { fontSize: 30, color: '#fff' },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  bottomTab: { fontSize: 14, fontWeight: 'bold', color: '#075E54', marginTop: 4 },

  bottomTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
