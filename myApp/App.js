import React, { useEffect, useState } from "react";
import { View, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./navigation/AppNavigator";
import SignInScreen from "./screens/SignInScreen";

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                setIsSignedIn(true);
            }
            setIsLoading(false);
        };

        // Start splash screen animation and check authentication
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => checkAuth());
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#2c5545" }}>
                <Animated.Image
                    source={require("./assets/logo.png")}
                    style={{ width: 150, height: 150, opacity: fadeAnim }}
                />
            </View>
        );
    }

    if (!isSignedIn) {
        return <SignInScreen onSignIn={() => setIsSignedIn(true)} />;
    }

    return <AppNavigator />;
};

export default App;
