import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MomentsOfDay = () => {
  const moments = [
    {
      id: 2,
      title: "Special Moments Compilation",
      thumbnail: "https://img.youtube.com/vi/N7ksxHpW1_M/0.jpg",
      videoId: "N7ksxHpW1_M",
    },
    {
      id: 1,
      title: "Inspiring Learning Moments",
      thumbnail: "https://img.youtube.com/vi/dCINrtfTJ5Q/0.jpg",
      videoId: "dCINrtfTJ5Q",
    },
  ];

  const openYouTubeVideo = (videoId) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(url).catch((err) =>
      console.error("Could not open URL", err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Moments of the Day</Text>
        <Text style={styles.headerSubtitle}>
          Special clips capturing our students' beautiful moments
        </Text>
      </View>

      <View style={styles.momentsGrid}>
        {moments.map((moment) => (
          <TouchableOpacity
            key={moment.id}
            style={styles.momentCard}
            onPress={() => openYouTubeVideo(moment.videoId)}
          >
            <Image
              source={{ uri: moment.thumbnail }}
              style={styles.momentThumbnail}
            />
            <View style={styles.momentDetails}>
              <Text style={styles.momentTitle} numberOfLines={2}>
                {moment.title}
              </Text>
              <View style={styles.momentActions}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => openYouTubeVideo(moment.videoId)}
                >
                  <Ionicons name="play-circle" size={24} color="#1ba94c" />
                  <Text style={styles.playButtonText}>Watch</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d141e",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  momentsGrid: {
    flexDirection: "column",
  },
  momentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  momentThumbnail: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "cover",
  },
  momentDetails: {
    padding: 16,
  },
  momentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d141e",
    marginBottom: 12,
  },
  momentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 169, 76, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  playButtonText: {
    color: "#1ba94c",
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default MomentsOfDay;
