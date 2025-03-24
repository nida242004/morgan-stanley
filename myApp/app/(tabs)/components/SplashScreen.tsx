import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const router = useRouter();

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const userType = await AsyncStorage.getItem("userType");

        // After splash animation, navigate to appropriate screen
        setTimeout(() => {
          if (authToken) {
            if (userType === "employee") {
              router.replace("/employee");
            } else if (userType === "student") {
              router.replace("/student");
            }
          } else {
            router.replace("/signin");
          }
        }, 2000); // 2 seconds for splash screen
      } catch (error) {
        console.error("Error checking login status:", error);
        router.replace("/signin");
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Replace with your app logo */}
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM_07Mi-1XEU8jdtQZv8MaIVmo6VeTyPHbag&s",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
