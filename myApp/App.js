import React, { useEffect, useState } from "react";
import { View, Image, Animated } from "react-native";
import SignInScreen from "./screens/SignInScreen";

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => setIsLoading(false));
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

    return <SignInScreen />;
};

export default App;
