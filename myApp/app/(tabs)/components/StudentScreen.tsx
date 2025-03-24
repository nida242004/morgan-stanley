import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StudentScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    // Clear all storage
    await AsyncStorage.multiRemove(["authToken", "userType"]);
    // Navigate to sign in
    router.replace("/signin");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1ba94c" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Parent Dashboard</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Welcome to the Parent Dashboard
          </Text>
          <Text style={styles.welcomeText}>
            This is a placeholder for the parent dashboard. You'll be able to
            track your child's progress, view reports, and communicate with
            educators here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f7f7",
  },
  header: {
  backgroundColor: "#1ba94c",
  paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30, // Add safe padding
  paddingBottom: 16,
  paddingHorizontal: 20,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  signOutText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d141e",
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: "#39424e",
    lineHeight: 24,
  },
});
