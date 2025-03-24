import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyBsCeTkekViD7qFma8TfWZSvfwrL0sUpmE";

export default function StudentScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingAi, setProcessingAi] = useState(false);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    fetchProfileData();

    // Request permission for camera/gallery
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Sorry, we need camera roll permissions to upload images!"
          );
        }
      }
    })();

    // Clean up audio when component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Session Expired", "Please sign in again");
        router.replace("/signin");
        return;
      }

      const response = await axios.get(
        "https://team-5-ishanyaindiafoundation.onrender.com/api/v1/student/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Combine student data and enrollment data into one object
      const combinedData = {
        ...response.data.data.student,
        enrollment: response.data.data.enrollment,
      };

      setProfileData(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Could not load profile data");
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Could not select image");
    }
  };

  const captureImage = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need camera permission to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Could not capture image");
    }
  };

  // Function to convert image to Base64
  const getImageBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      throw error;
    }
  };

  const sendToAI = async () => {
    if (!aiPrompt.trim() && !selectedImage) {
      Alert.alert("Input Required", "Please provide a question or image");
      return;
    }

    try {
      setProcessingAi(true);
      setAiResponse(null);

      // Initialize the Gemini API client
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // System instruction prompt
      const systemPrompt = `
  You are an AI assistant named 'Maya', designed to help parents of special needs children. 
  You have access to confidential student information and should provide helpful, compassionate guidance.

  Student Information:
  - Name: ${profileData.firstName} ${profileData.lastName}
  - Student ID: ${profileData.studentID}
  - Primary Diagnosis: ${profileData.primaryDiagnosis.name}
  - Diagnosis Description: ${profileData.primaryDiagnosis.description}
  
  Comorbidities: ${profileData.comorbidity.map((c) => c.name).join(", ")}
  
  Educational Program: ${profileData.enrollment.programs[0].name}
  Program Description: ${profileData.enrollment.programs[0].description}
  
  Educators:
  - Primary Educator: ${profileData.enrollment.educator.firstName} (Phone: ${
        profileData.enrollment.educator.phoneNumber
      })
  - Secondary Educator: ${
    profileData.enrollment.secondaryEducator.firstName
  } (Phone: ${profileData.enrollment.secondaryEducator.phoneNumber})
  
  Student Strengths: ${profileData.strengths}
  Areas to Develop: ${profileData.weaknesses}

  Guidelines:
  - Provide clear, supportive, and easy-to-understand responses
  - Focus on positive aspects and potential growth
  - Offer practical advice for parents
  - Maintain confidentiality and sensitivity
  - Do not use Markdown; return plain text
  - Speak in a warm, empathetic tone
  - For simple queries, give concise to the point polite answer
`;

      // Prepare content parts
      const contentParts = [systemPrompt];

      // Add user input if provided
      if (aiPrompt.trim()) {
        contentParts.push(aiPrompt);
      }

      // Add image if selected
      if (selectedImage) {
        const base64Image = await getImageBase64(selectedImage.uri);

        // Determine mime type
        const mimeType = selectedImage.uri.endsWith(".png")
          ? "image/png"
          : selectedImage.uri.endsWith(".gif")
          ? "image/gif"
          : "image/jpeg";

        contentParts.push({
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        });
      }

      // Generate content
      const result = await model.generateContent(contentParts);
      const response = await result.response;
      const text = response.text();

      // Save the response
      const aiResponseData = {
        text: text,
        timestamp: new Date().toISOString(),
      };

      setAiResponse(aiResponseData);
      setProcessingAi(false);

      // Cache recent responses (optional)
      try {
        const recentResponses = await AsyncStorage.getItem("recentAIResponses");
        let responses = recentResponses ? JSON.parse(recentResponses) : [];
        responses.unshift(aiResponseData);
        // Keep only last 5 responses
        responses = responses.slice(0, 5);
        await AsyncStorage.setItem(
          "recentAIResponses",
          JSON.stringify(responses)
        );
      } catch (error) {
        console.error("Error caching response:", error);
      }
    } catch (error) {
      console.error("AI help error:", error);
      Alert.alert(
        "Error",
        "Could not process your request. Please check your API key and network connection."
      );
      setProcessingAi(false);
    }
  };

  const playTTS = async () => {
    if (!aiResponse?.text) {
      Alert.alert("No Content", "There's no text to speak");
      return;
    }

    try {
      // If already speaking, stop it
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      // Configure speech options for slower, clearer speech
      const speechOptions = {
        language: "en",
        pitch: 1.0, // Slightly lower pitch
        rate: 0.7, // Slower speed (0.5-1.0 is good for special needs)
        quality: "Enhanced", // Better quality if supported
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: (error) => {
          console.error("TTS error:", error);
          setIsSpeaking(false);
          Alert.alert("Error", "Could not play speech");
        },
      };

      // Speak the text
      await Speech.speak(aiResponse.text, speechOptions);
    } catch (error) {
      console.error("Error with TTS:", error);
      setIsSpeaking(false);
      Alert.alert("Error", "Could not play audio");
    }
  };

  const clearAIPrompt = () => {
    setAiPrompt("");
    setSelectedImage(null);
    setAiResponse(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove(["authToken", "userType"]);
      router.replace("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Could not sign out properly");
    }
  };

  // Profile Tab Content
 const renderProfileTab = () => (
   <ScrollView contentContainerStyle={styles.profileContent}>
     {loading ? (
       <ActivityIndicator size="large" color="#1ba94c" style={styles.loader} />
     ) : profileData ? (
       <>
         <View style={styles.profileHeader}>
           <Image
             source={{
               uri: profileData.photo
                 ? profileData.photo
                 : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
             }}
             style={styles.profilePhoto}
           />
           <Text style={styles.profileName}>
             {profileData.firstName} {profileData.lastName}
           </Text>
           <Text style={styles.profileId}>ID: {profileData.studentID}</Text>
         </View>

         <View style={styles.infoCard}>
           <Text style={styles.sectionTitle}>Personal Information</Text>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Gender:</Text>
             <Text style={styles.infoValue}>{profileData.gender || "N/A"}</Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Date of Birth:</Text>
             <Text style={styles.infoValue}>{formatDate(profileData.dob)}</Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Blood Group:</Text>
             <Text style={styles.infoValue}>
               {profileData.bloodGroup || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Enrollment Date:</Text>
             <Text style={styles.infoValue}>
               {formatDate(profileData.enrollment.updatedAt)}
             </Text>
           </View>
         </View>

         <View style={styles.infoCard}>
           <Text style={styles.sectionTitle}>Contact Information</Text>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Email:</Text>
             <Text style={styles.infoValue}>{profileData.email || "N/A"}</Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Phone:</Text>
             <Text style={styles.infoValue}>
               {profileData.phoneNumber || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Alternative Phone:</Text>
             <Text style={styles.infoValue}>
               {profileData.secondaryPhoneNumber || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Address:</Text>
             <Text style={styles.infoValue}>
               {profileData.address || "N/A"}
             </Text>
           </View>
         </View>

         <View style={styles.infoCard}>
           <Text style={styles.sectionTitle}>Family Information</Text>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Father's Name:</Text>
             <Text style={styles.infoValue}>
               {profileData.fatherName || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Mother's Name:</Text>
             <Text style={styles.infoValue}>
               {profileData.motherName || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Parent Email:</Text>
             <Text style={styles.infoValue}>
               {profileData.parentEmail || "N/A"}
             </Text>
           </View>
         </View>

         <View style={styles.infoCard}>
           <Text style={styles.sectionTitle}>Medical Information</Text>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Allergies:</Text>
             <Text style={styles.infoValue}>
               {profileData.allergies || "None"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Primary Diagnosis:</Text>
             <Text style={styles.infoValue}>
               {profileData.primaryDiagnosis?.name || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Diagnosis Description:</Text>
             <Text style={styles.infoValue}>
               {profileData.primaryDiagnosis?.description || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Comorbidities:</Text>
             <Text style={styles.infoValue}>
               {profileData.comorbidity?.map((c) => c.name).join(", ") ||
                 "None"}
             </Text>
           </View>
         </View>

         <View style={styles.infoCard}>
           <Text style={styles.sectionTitle}>Educational Profile</Text>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Program:</Text>
             <Text style={styles.infoValue}>
               {profileData.enrollment?.programs[0]?.name || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Program Description:</Text>
             <Text style={styles.infoValue}>
               {profileData.enrollment?.programs[0]?.description || "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Primary Educator:</Text>
             <Text style={styles.infoValue}>
               {profileData.enrollment?.educator?.firstName
                 ? `${profileData.enrollment.educator.firstName} (${profileData.enrollment.educator.phoneNumber})`
                 : "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Secondary Educator:</Text>
             <Text style={styles.infoValue}>
               {profileData.enrollment?.secondaryEducator?.firstName
                 ? `${profileData.enrollment.secondaryEducator.firstName} (${profileData.enrollment.secondaryEducator.phoneNumber})`
                 : "N/A"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Strengths:</Text>
             <Text style={styles.infoValue}>
               {profileData.strengths || "Not specified"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Areas to Develop:</Text>
             <Text style={styles.infoValue}>
               {profileData.weaknesses || "Not specified"}
             </Text>
           </View>

           <View style={styles.infoRow}>
             <Text style={styles.infoLabel}>Transport Required:</Text>
             <Text style={styles.infoValue}>
               {profileData.transport ? "Yes" : "No"}
             </Text>
           </View>
         </View>
       </>
     ) : (
       <View style={styles.errorContainer}>
         <Text style={styles.errorText}>Could not load profile data</Text>
         <TouchableOpacity
           style={styles.retryButton}
           onPress={fetchProfileData}
         >
           <Text style={styles.retryButtonText}>Retry</Text>
         </TouchableOpacity>
       </View>
     )}
   </ScrollView>
 );

  // Reports Tab Content
  const renderReportsTab = () => (
    <ScrollView contentContainerStyle={styles.reportsContent}>
      <View style={styles.emptyStateContainer}>
        <Ionicons name="document-text-outline" size={60} color="#ccc" />
        <Text style={styles.emptyStateTitle}>No Reports Available</Text>
        <Text style={styles.emptyStateText}>
          Your child's progress reports and assessments will appear here once
          available.
        </Text>
      </View>
    </ScrollView>
  );

  // AI Help Tab Content
  const renderAIHelpTab = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.aiContent}>
        <View style={styles.aiHelpContainer}>
          <Text style={styles.aiHelpTitle}>AI Dost</Text>
          <Text style={styles.aiHelpSubtitle}>
            Ask any questions about supporting your child's development.
          </Text>

          {selectedImage && (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={24} color="#ff4d4f" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.promptInputContainer}>
            <TextInput
              style={styles.promptInput}
              placeholder="Ask a question..."
              value={aiPrompt}
              onChangeText={setAiPrompt}
              multiline
            />
            <View style={styles.promptActions}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <Ionicons name="image-outline" size={24} color="#1ba94c" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={captureImage}
              >
                <Ionicons name="camera-outline" size={24} color="#1ba94c" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !aiPrompt.trim() &&
                    !selectedImage &&
                    styles.sendButtonDisabled,
                ]}
                onPress={sendToAI}
                disabled={processingAi || (!aiPrompt.trim() && !selectedImage)}
              >
                {processingAi ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {aiResponse && (
            <View style={styles.aiResponseContainer}>
              <View style={styles.aiResponseHeader}>
                <Text style={styles.aiResponseTitle}>AI Response</Text>
                <View style={styles.aiResponseActions}>
                  <TouchableOpacity
                    style={styles.speakerButton}
                    onPress={playTTS}
                  >
                    <Ionicons
                      name={isPlaying ? "volume-high" : "volume-medium-outline"}
                      size={24}
                      color="#1ba94c"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearAIPrompt}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={20}
                      color="#39424e"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.aiResponseText}>{aiResponse.text}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1ba94c" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === "profile"
            ? "Profile"
            : activeTab === "reports"
            ? "Reports"
            : "AI Help"}
        </Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "reports" && renderReportsTab()}
        {activeTab === "ai" && renderAIHelpTab()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === "profile" && styles.activeNavButton,
          ]}
          onPress={() => setActiveTab("profile")}
        >
          <Ionicons
            name={activeTab === "profile" ? "person" : "person-outline"}
            size={24}
            color={activeTab === "profile" ? "#1ba94c" : "#39424e"}
          />
          <Text
            style={[
              styles.navButtonText,
              activeTab === "profile" && styles.activeNavButtonText,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === "reports" && styles.activeNavButton,
          ]}
          onPress={() => setActiveTab("reports")}
        >
          <MaterialIcons
            name={activeTab === "reports" ? "assessment" : "assessment"}
            size={24}
            color={activeTab === "reports" ? "#1ba94c" : "#39424e"}
          />
          <Text
            style={[
              styles.navButtonText,
              activeTab === "reports" && styles.activeNavButtonText,
            ]}
          >
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === "ai" && styles.activeNavButton,
          ]}
          onPress={() => setActiveTab("ai")}
        >
          <FontAwesome5
            name="robot"
            size={22}
            color={activeTab === "ai" ? "#1ba94c" : "#39424e"}
          />
          <Text
            style={[
              styles.navButtonText,
              activeTab === "ai" && styles.activeNavButtonText,
            ]}
          >
            AI Help
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: Platform.OS === "android" ? 40 : 10,
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
    flex: 1,
  },
  bottomNavbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeNavButton: {
    borderTopWidth: 3,
    borderTopColor: "#1ba94c",
    backgroundColor: "rgba(27, 169, 76, 0.05)",
  },
  navButtonText: {
    fontSize: 12,
    marginTop: 4,
    color: "#39424e",
  },
  activeNavButtonText: {
    color: "#1ba94c",
    fontWeight: "600",
  },

  // Profile Tab Styles
  profileContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loader: {
    marginTop: 50,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d141e",
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: "#39424e",
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0d141e",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  infoLabel: {
    fontSize: 15,
    color: "#555",
    flex: 0.4,
  },
  infoValue: {
    fontSize: 15,
    color: "#0d141e",
    fontWeight: "500",
    flex: 0.6,
    textAlign: "right",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#1ba94c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Reports Tab Styles
  reportsContent: {
    padding: 16,
    flex: 1,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 50,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#39424e",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  // AI Help Tab Styles
  aiContent: {
    padding: 16,
    paddingBottom: 32,
  },
  aiHelpContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  aiHelpTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d141e",
    marginBottom: 8,
  },
  aiHelpSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  promptInputContainer: {
    marginBottom: 16,
  },
  promptInput: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  promptActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  imagePickerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(27, 169, 76, 0.1)",
    marginRight: 8,
  },
  cameraButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(27, 169, 76, 0.1)",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#1ba94c",
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#aaa",
  },
  selectedImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 2,
  },
  aiResponseContainer: {
    backgroundColor: "#f8fbf8",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e6f0e6",
    marginTop: 16,
  },
  aiResponseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e6f0e6",
    paddingBottom: 8,
  },
  aiResponseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1ba94c",
  },
  aiResponseActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  speakerButton: {
    padding: 6,
    marginRight: 8,
  },
  clearButton: {
    padding: 6,
  },
  aiResponseText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});
