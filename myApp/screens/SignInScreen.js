import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const SignInScreen = ({ navigation, onSignIn }) => {
    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `https://team-5-ishanyaindiafoundation.onrender.com/api/v1/${formData.userType}/login`,
                formData
            );

            const token = response.data.data?.accessToken;
            if (token) {
                await AsyncStorage.setItem("authToken", token);
                onSignIn(); // Notify App.js that the user is signed in
                navigation.navigate(formData.userType === "employee" ? "EmployeeHome" : "ParentHome");
            }
        } catch (error) {
            alert("Login failed. Check your credentials.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />

            <Text style={styles.title}>Sign In</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, formData.userType === "employee" ? styles.selected : {}]}
                    onPress={() => setFormData({ ...formData, userType: "employee" })}
                >
                    <Text style={styles.buttonText}>Employee</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, formData.userType === "parent" ? styles.selected : {}]}
                    onPress={() => setFormData({ ...formData, userType: "parent" })}
                >
                    <Text style={styles.buttonText}>Parent</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f1ed",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2c5545",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        padding: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
        backgroundColor: "white",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    button: {
        flex: 1,
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: "#2c5545",
    },
    selected: {
        backgroundColor: "#2c5545",
    },
    buttonText: {
        color: "#2c5545",
        fontWeight: "bold",
    },
    loginButton: {
        width: "100%",
        padding: 15,
        backgroundColor: "#daa520",
        alignItems: "center",
        borderRadius: 5,
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default SignInScreen;
