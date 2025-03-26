import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyBsCeTkekViD7qFma8TfWZSvfwrL0sUpmE";

const ReportsTab = ({ profileData }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const [expandedReports, setExpandedReports] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Session Expired", "Please sign in again");
        return;
      }

      const response = await axios.get(
        "https://team-5-ishanyaindiafoundation.onrender.com/api/v1/student/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.scoreCards) {
        setReports(response.data.scoreCards);
        generateAIInsights(response.data.scoreCards);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      Alert.alert("Error", "Could not load reports");
      setLoading(false);
    }
  };

  const generateAIInsights = async (scoreCards) => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const systemPrompt = `
You are an AI assistant providing insights for a special needs student's progress report.

Student Information:
- Name: ${profileData.firstName} ${profileData.lastName}
- Primary Diagnosis: ${profileData.primaryDiagnosis.name}

Report Insights Guidelines:
- Provide a compassionate and encouraging analysis
- Highlight strengths and areas of improvement
- Offer constructive suggestions for parents and educators
- Use clear, simple language
- Give answer in plain text format. NOT in .md format, cuz the text will be displayed as it is
- Focus on the student's potential and growth
- Maintain a positive and supportive tone
`;

      const reportsPrompt = `
Analyze these score cards and provide comprehensive insights:

${scoreCards
  .map(
    (report) => `
Skill Area: ${report.skill_area_id.name}
Sub-Task: ${report.sub_task_id.name}
Month: ${report.month}
Week: ${report.week}
Score: ${report.score}/5
Description: ${report.description}
`
  )
  .join("\n")}

Please provide a holistic overview of the student's progress, identifying key strengths, areas for development, and actionable recommendations.
`;

      const result = await model.generateContent([systemPrompt, reportsPrompt]);
      const response = await result.response;
      const text = response.text();

      setAiInsights(text);
    } catch (error) {
      console.error("AI Insights generation error:", error);
      setAiInsights(
        "Unable to generate AI insights at the moment. Please try again later."
      );
    }
  };

  const toggleReportExpansion = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const renderReportItem = (report) => {
    const isExpanded = expandedReports[report._id];
    const scoreColor = getScoreColor(report.score);

    return (
      <TouchableOpacity
        key={report._id}
        style={styles.reportItem}
        onPress={() => toggleReportExpansion(report._id)}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportTitleContainer}>
            <Text style={styles.reportTitle}>
              {report.skill_area_id.name}
            </Text>
            <Text style={styles.reportSubtitle}>
              {report.sub_task_id.name}
            </Text>
          </View>
          <View style={[styles.scoreContainer, { backgroundColor: scoreColor }]}>
            <Text style={styles.scoreText}>{report.score}/5</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.reportDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Month:</Text>
              <Text style={styles.detailValue}>{report.month}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Week:</Text>
              <Text style={styles.detailValue}>{report.week}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailDescription}>
                {report.description}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 4) return "#4CAF50"; // Green
    if (score >= 3) return "#FFC107"; // Yellow
    return "#FF5722"; // Red
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1ba94c" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {reports.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="document-text-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Reports Available</Text>
          <Text style={styles.emptyStateText}>
            Your child's progress reports and assessments will appear here once
            available.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="assessment" size={24} color="#1ba94c" />
            <Text style={styles.sectionTitle}>Progress Reports</Text>
          </View>

          {reports.map(renderReportItem)}

          {aiInsights && (
            <View style={styles.aiInsightsContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles" size={24} color="#1ba94c" />
                <Text style={styles.sectionTitle}>AI Insights</Text>
              </View>
              <Text style={styles.aiInsightsText}>{aiInsights}</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1ba94c",
    marginLeft: 8,
  },
  reportItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reportTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d141e",
  },
  reportSubtitle: {
    fontSize: 14,
    color: "#39424e",
    marginTop: 4,
  },
  scoreContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#555",
    marginRight: 8,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#0d141e",
    flex: 1,
  },
  detailDescription: {
    fontSize: 14,
    color: "#39424e",
    lineHeight: 20,
  },
  aiInsightsContainer: {
    backgroundColor: "#f8fbf8",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e6f0e6",
  },
  aiInsightsText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});

export default ReportsTab;