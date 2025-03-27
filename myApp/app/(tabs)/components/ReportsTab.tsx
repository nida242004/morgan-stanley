import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyBsCeTkekViD7qFma8TfWZSvfwrL0sUpmE";

const ReportsTab = ({ profileData }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const [expandedReports, setExpandedReports] = useState({});

  // Filters
  const [selectedSkillArea, setSelectedSkillArea] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Unique skill areas and months for filtering
  const skillAreas = [...new Set(reports.map((r) => r.skill_area_id.name))];
  const months = [...new Set(reports.map((r) => r.month))];

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, selectedSkillArea, selectedMonth]);

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

  const filterReports = () => {
    let filtered = reports;

    if (selectedSkillArea) {
      filtered = filtered.filter(
        (r) => r.skill_area_id.name === selectedSkillArea
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter((r) => r.month === selectedMonth);
    }

    setFilteredReports(filtered);
  };

  const clearFilters = () => {
    setSelectedSkillArea(null);
    setSelectedMonth(null);
    setFilterModalVisible(false);
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
- Provide a compassionate and encouraging analysis in plain text format cuz the response will be displayed as it is.
- Highlight strengths and areas of improvement
- Offer constructive suggestions for parents and educators
- Use clear, simple language
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
            <Text style={styles.reportTitle}>{report.skill_area_id.name}</Text>
            <Text style={styles.reportSubtitle}>{report.sub_task_id.name}</Text>
          </View>
          <View style={styles.headerRight}>
            <View
              style={[styles.scoreContainer, { backgroundColor: scoreColor }]}
            >
              <Text style={styles.scoreText}>{report.score}/5</Text>
            </View>
            <AntDesign
              name={isExpanded ? "caretup" : "caretdown"}
              size={16}
              color="#666"
            />
          </View>
        </View>

        {isExpanded && (
          <View style={styles.reportDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Month:</Text>
              <Text
                style={styles.detailValue}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {report.month}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Week:</Text>
              <Text
                style={styles.detailValue}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {report.week}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text
                style={styles.detailDescription}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
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
  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Reports</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Skill Area</Text>
            {skillAreas.map((area) => (
              <TouchableOpacity
                key={area}
                style={[
                  styles.filterOption,
                  selectedSkillArea === area && styles.selectedFilterOption,
                ]}
                onPress={() => setSelectedSkillArea(area)}
              >
                <Text style={styles.filterOptionText}>{area}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Month</Text>
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.filterOption,
                  selectedMonth === month && styles.selectedFilterOption,
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <Text style={styles.filterOptionText}>{month}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={clearFilters}>
              <Text style={styles.modalButtonText}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.modalButtonTextPrimary}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1ba94c" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Ionicons name="filter" size={20} color="#1ba94c" />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      {/* AI Insights - Moved to top */}
      {aiInsights && (
        <View style={styles.aiInsightsContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={24} color="#1ba94c" />
            <Text style={styles.sectionTitle}>AI Insights</Text>
          </View>
          <Text style={styles.aiInsightsText}>{aiInsights}</Text>
        </View>
      )}

      {/* Reports Section */}
      {filteredReports.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="document-text-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Reports Available</Text>
          <Text style={styles.emptyStateText}>
            {selectedSkillArea || selectedMonth
              ? "No reports match your current filters."
              : "Your child's progress reports and assessments will appear here once available."}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="assessment" size={24} color="#1ba94c" />
            <Text style={styles.sectionTitle}>Progress Reports</Text>
          </View>

          {filteredReports.map(renderReportItem)}
        </>
      )}

      {renderFilterModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... [Previous styles remain the same]
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
  // New styles for filtering
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  filterButtonText: {
    marginLeft: 8,
    color: "#1ba94c",
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  filterOption: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: "#e6f0e6",
  },
  filterOptionText: {
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#1ba94c",
  },
  modalButtonText: {
    color: "#1ba94c",
    fontWeight: "600",
  },
  modalButtonTextPrimary: {
    color: "white",
    fontWeight: "600",
  },
});

export default ReportsTab;
