import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "student", // Default to 'student' (parent)
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Colors similar to the web version
  const colors = {
    primary: "#1ba94c", // Green
    secondary: "#0d141e", // Dark Blue
    accent: "#39424e", // Medium Gray-Blue
    light: "#f3f7f7", // Light Gray
    textDark: "#0d141e", // Dark Blue for text
    textLight: "#39424e", // Medium Gray-Blue for text
  };

  const userTypes = [
    { id: "student", label: "Parent" },
    { id: "employee", label: "Educator" },
  ];

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://team-5-ishanyaindiafoundation.onrender.com/api/v1/${formData.userType}/login`,
        formData
      );

      let token = response.data.data?.accessToken;

      if (token) {
        console.log("Token found and stored:", token.substring(0, 10) + "...");
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userType", formData.userType);

        // Navigate based on user type
        if (formData.userType === "employee") {
          router.replace("/employee");
        } else {
          router.replace("/student");
        }
      } else {
        Alert.alert("Login Failed", "No token received. Please try again.");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image
                      source={{
                        uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM_07Mi-1XEU8jdtQZv8MaIVmo6VeTyPHbag&s",
                      }}
                      style={styles.logo}
                      resizeMode="contain"
                    />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access your account</Text>
          </View>

          {/* User Type Selection */}
          <View style={styles.userTypeContainer}>
            <Text style={styles.sectionTitle}>Sign in as:</Text>
            <View style={styles.userTypeButtons}>
              {userTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.userTypeButton,
                    formData.userType === type.id &&
                      styles.userTypeButtonActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, userType: type.id })
                  }
                >
                  <Text
                    style={[
                      styles.userTypeText,
                      formData.userType === type.id &&
                        styles.userTypeTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email / User ID</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email or user ID"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordLabelContainer}>
                <Text style={styles.inputLabel}>Password</Text>
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textLight}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f3f7f7",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d141e",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#39424e",
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d141e",
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  userTypeButtonActive: {
    backgroundColor: "rgba(27, 169, 76, 0.1)",
    borderColor: "#1ba94c",
  },
  userTypeText: {
    color: "#39424e",
    fontWeight: "500",
  },
  userTypeTextActive: {
    color: "#1ba94c",
    fontWeight: "600",
  },
  form: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  passwordLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotPassword: {
    color: "#1ba94c",
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0d141e",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#1ba94c",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
