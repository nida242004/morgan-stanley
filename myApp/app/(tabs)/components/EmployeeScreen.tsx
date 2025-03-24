import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Color scheme matching the web version
const colors = {
  pampas: '#f2f1ed',    // Light beige/neutral
  killarney: '#2c5545',  // Deep green
  goldenGrass: '#daa520', // Golden yellow
  mulberry: '#C54B8C'    // Purple/pink
};

export default function EmployeeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    verdict: "",
    remarks: "",
    status: "",
  });
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch the auth token
  useEffect(() => {
    const checkAuth = async () => {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        router.replace("/signin");
      }
    };

    checkAuth();
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) return;

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      try {
        setLoading(true);

        // Fetch profile data
        const profileRes = await axios.get(
          "https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/",
          axiosConfig
        );
        setProfile(profileRes.data.data.employee);

        // Fetch enrollments (students)
        const studentsRes = await axios.get(
          "https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/myEnrollments",
          axiosConfig
        );
        setStudents(studentsRes.data.data.enrollments);

        // Fetch appointments
        const appointmentsRes = await axios.get(
          "https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/appointments",
          axiosConfig
        );
        setAppointments(appointmentsRes.data.data.appointments);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);

        // If unauthorized error (401), redirect to signin
        if (error.response && error.response.status === 401) {
          await AsyncStorage.removeItem("authToken");
          router.replace("/signin");
        }

        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle appointment update
  const handleUpdateAppointment = async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) return;

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const payload = {
        appointmentId: selectedAppointment._id,
        verdict: updateForm.verdict,
        remarks: updateForm.remarks,
        status: updateForm.status,
      };

      await axios.post(
        "https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/update_appointment",
        payload,
        axiosConfig
      );

      // Update the appointments list
      const updatedAppointments = appointments.map((app) =>
        app._id === selectedAppointment._id
          ? {
              ...app,
              verdict: updateForm.verdict,
              remarks: updateForm.remarks,
              status: updateForm.status,
            }
          : app
      );

      setAppointments(updatedAppointments);
      setShowModal(false);

      Alert.alert("Success", "Appointment updated successfully", [
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Error updating appointment:", error);

      Alert.alert("Error", "Failed to update appointment. Please try again.", [
        { text: "OK" },
      ]);

      // If unauthorized error (401), redirect to signin
      if (error.response && error.response.status === 401) {
        await AsyncStorage.removeItem("authToken");
        router.replace("/signin");
      }
    }
  };

  // Open update modal
  const openUpdateModal = (appointment) => {
    // Skip if already completed
    if (appointment.status === "completed") {
      Alert.alert(
        "Completed Appointment",
        "This appointment has already been completed and cannot be updated further.",
        [{ text: "OK" }]
      );
      return;
    }

    setSelectedAppointment(appointment);
    setUpdateForm({
      verdict: appointment.verdict || "",
      remarks: appointment.remarks || "",
      status: appointment.status || "",
    });
    setShowModal(true);
  };

  // Handle sign out
  const handleSignOut = async () => {
    setLoggingOut(true);

    // Add a delay to show the animation before redirecting
    setTimeout(async () => {
      await AsyncStorage.removeItem("authToken");
      router.replace("/signin");
    }, 800);
  };

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = appointment.studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter students based on search
  const filteredStudents = students.filter(
    (enrollment) =>
      enrollment.student.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.student.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.student.studentID
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.killarney} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  // Render Profile Tab Content
  const renderProfileContent = () => {
    if (!profile) return null;

    const personalInfo = [
      { label: "Employee ID", value: profile.employeeID, icon: "person-badge" },
      {
        label: "Full Name",
        value: `${profile.firstName} ${profile.lastName}`,
        icon: "person",
      },
      { label: "Gender", value: profile.gender, icon: "male-female" },
      { label: "Email", value: profile.email, icon: "mail" },
      { label: "Contact", value: profile.contact, icon: "call" },
      { label: "Address", value: profile.address, icon: "location" },
    ];

    const employmentInfo = [
      {
        label: "Employment Type",
        value: profile.employmentType,
        icon: "briefcase",
      },
      { label: "Status", value: profile.status, icon: "checkmark-circle" },
      {
        label: "Date of Joining",
        value: new Date(profile.dateOfJoining).toLocaleDateString(),
        icon: "calendar",
      },
      { label: "Work Location", value: profile.workLocation, icon: "business" },
      {
        label: "Designation",
        value: profile.designation?.title,
        icon: "ribbon",
      },
      {
        label: "Department",
        value: profile.department?.name,
        icon: "git-network",
      },
      {
        label: "Programs",
        value: profile.programs?.map((p) => p.name).join(", "),
        icon: "list",
      },
    ];

    return (
      <ScrollView contentContainerStyle={styles.profileContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Ionicons name="person-circle" size={80} color="white" />
          </View>
          <Text style={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.profileTitle}>{profile.designation?.title}</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile.department?.name}</Text>
            </View>
            <View
              style={[styles.badge, { backgroundColor: colors.goldenGrass }]}
            >
              <Text style={styles.badgeText}>{profile.status}</Text>
            </View>
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={20} color={colors.killarney} />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          {personalInfo.map((field, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                { backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white" },
              ]}
            >
              <Ionicons
                name={field.icon}
                size={18}
                color={colors.killarney}
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>{field.label}:</Text>
              <Text style={styles.infoValue}>{field.value || "N/A"}</Text>
            </View>
          ))}
        </View>

        {/* Employment Info */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="briefcase" size={20} color={colors.killarney} />
            <Text style={styles.cardTitle}>Employment Information</Text>
          </View>
          {employmentInfo.map((field, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                { backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white" },
              ]}
            >
              <Ionicons
                name={field.icon}
                size={18}
                color={colors.goldenGrass}
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>{field.label}:</Text>
              <Text style={styles.infoValue}>{field.value || "N/A"}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  // Render Students Tab Content
  const renderStudentsContent = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {filteredStudents.length > 0 ? (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.studentCard}>
                <View style={styles.studentHeader}>
                  <View style={styles.studentImageContainer}>
                    <Ionicons
                      name="person"
                      size={24}
                      color={colors.killarney}
                    />
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>
                      {item.student.firstName} {item.student.lastName}
                    </Text>
                    <Text style={styles.studentId}>
                      ID: {item.student.studentID}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.status === "Active" ? "#28a745" : "#6c757d",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.studentDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Primary Diagnosis:</Text>
                    <Text style={styles.detailValue}>
                      {item.student.primaryDiagnosis?.name || "N/A"}
                    </Text>
                  </View>

                  {item.student.comorbidity &&
                    item.student.comorbidity.length > 0 && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Comorbidity:</Text>
                        <Text style={styles.detailValue}>
                          {item.student.comorbidity
                            .map((c) => c.name)
                            .join(", ")}
                        </Text>
                      </View>
                    )}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Level:</Text>
                    <Text style={styles.detailValue}>{item.level}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Programs:</Text>
                    <Text style={styles.detailValue}>
                      {item.programs.map((p) => p.name).join(", ")}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Primary Educator:</Text>
                    <Text style={styles.detailValue}>
                      {item.educator?.firstName} {item.educator?.lastName}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color={colors.killarney}
                  />
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.studentsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>
              No students found matching your search criteria
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render Appointments Tab Content
  const renderAppointmentsContent = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "all" && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === "all" && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "scheduled" && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter("scheduled")}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === "scheduled" && styles.activeFilterText,
              ]}
            >
              Scheduled
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "completed" && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter("completed")}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === "completed" && styles.activeFilterText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {filteredAppointments.length > 0 ? (
          <FlatList
            data={filteredAppointments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentStudent}>
                    {item.studentName}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.status === "completed"
                            ? "#28a745"
                            : item.status === "cancelled"
                            ? "#dc3545"
                            : "#ffc107",
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.appointmentDetails}>
                  <View style={styles.appointmentDetail}>
                    <Ionicons name="person-outline" size={16} color="#666" />
                    <Text style={styles.appointmentDetailText}>
                      Parent: {item.parentName}
                    </Text>
                  </View>

                  <View style={styles.appointmentDetail}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.appointmentDetailText}>
                      Date:{" "}
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>

                  <View style={styles.appointmentDetail}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.appointmentDetailText}>
                      Time:{" "}
                      {`${item.time.hr}:${item.time.min
                        .toString()
                        .padStart(2, "0")}`}
                    </Text>
                  </View>

                  {item.verdict && (
                    <View style={styles.appointmentDetail}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.appointmentDetailText}>
                        Verdict: {item.verdict}
                      </Text>
                    </View>
                  )}

                  {item.remarks && (
                    <View style={styles.appointmentDetail}>
                      <Ionicons
                        name="document-text-outline"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.appointmentDetailText}>
                        Remarks: {item.remarks}
                      </Text>
                    </View>
                  )}
                </View>

                {item.status !== "completed" && (
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => openUpdateModal(item)}
                  >
                    <Ionicons name="create-outline" size={16} color="white" />
                    <Text style={styles.updateButtonText}>Update</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            contentContainerStyle={styles.appointmentsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>
              No appointments found matching your criteria
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.killarney} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === "profile"
            ? "My Profile"
            : activeTab === "students"
            ? "My Students"
            : "My Appointments"}
        </Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {activeTab === "profile" && renderProfileContent()}
        {activeTab === "students" && renderStudentsContent()}
        {activeTab === "appointments" && renderAppointmentsContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("profile")}
        >
          <Ionicons
            name={
              activeTab === "profile"
                ? "person-circle"
                : "person-circle-outline"
            }
            size={24}
            color={activeTab === "profile" ? colors.goldenGrass : "#fff"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "profile" && styles.activeNavLabel,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("students")}
        >
          <Ionicons
            name={activeTab === "students" ? "school" : "school-outline"}
            size={24}
            color={activeTab === "students" ? colors.goldenGrass : "#fff"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "students" && styles.activeNavLabel,
            ]}
          >
            Students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("appointments")}
        >
          <Ionicons
            name={
              activeTab === "appointments" ? "calendar" : "calendar-outline"
            }
            size={24}
            color={activeTab === "appointments" ? colors.goldenGrass : "#fff"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "appointments" && styles.activeNavLabel,
            ]}
          >
            Appointments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Update Appointment Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Appointment</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {selectedAppointment && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Student</Text>
                  <TextInput
                    style={[styles.formControl, styles.formControlDisabled]}
                    value={selectedAppointment.studentName}
                    editable={false}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Status</Text>
                  <View style={styles.pickerContainer}>
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        updateForm.status === "scheduled" &&
                          styles.pickerItemActive,
                      ]}
                      onPress={() =>
                        setUpdateForm({ ...updateForm, status: "scheduled" })
                      }
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          updateForm.status === "scheduled" &&
                            styles.pickerItemTextActive,
                        ]}
                      >
                        Scheduled
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        updateForm.status === "completed" &&
                          styles.pickerItemActive,
                      ]}
                      onPress={() =>
                        setUpdateForm({ ...updateForm, status: "completed" })
                      }
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          updateForm.status === "completed" &&
                            styles.pickerItemTextActive,
                        ]}
                      >
                        Completed
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Verdict</Text>
                  <View style={styles.pickerContainer}>
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        updateForm.verdict === "joined" &&
                          styles.pickerItemActive,
                      ]}
                      onPress={() =>
                        setUpdateForm({ ...updateForm, verdict: "joined" })
                      }
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          updateForm.verdict === "joined" &&
                            styles.pickerItemTextActive,
                        ]}
                      >
                        Joined
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        updateForm.verdict === "recommendation" &&
                          styles.pickerItemActive,
                      ]}
                      onPress={() =>
                        setUpdateForm({
                          ...updateForm,
                          verdict: "recommendation",
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          updateForm.verdict === "recommendation" &&
                            styles.pickerItemTextActive,
                        ]}
                      >
                        Recommendation
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Remarks</Text>
                  <TextInput
                    style={[styles.formControl, styles.textArea]}
                    multiline={true}
                    numberOfLines={4}
                    value={updateForm.remarks}
                    onChangeText={(text) =>
                      setUpdateForm({ ...updateForm, remarks: text })
                    }
                    placeholder="Add your notes about this appointment..."
                  />
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleUpdateAppointment}
              >
                <Text style={styles.modalButtonTextPrimary}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pampas,
  },
  header: {
    backgroundColor: colors.killarney,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  signOutButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.killarney,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ffffff20',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  activeNavLabel: {
    color: colors.goldenGrass,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.killarney,
  },
  profileContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.killarney,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.killarney,
  },
  profileTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: colors.killarney,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.killarney,
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    width: '40%',
    fontWeight: '500',
    color: '#555',
  },
  infoValue: {
    width: '60%',
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.killarney,
  },
  studentId: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  studentDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    width: '40%',
    fontWeight: '500',
    color: '#555',
  },
  detailValue: {
    width: '60%',
    fontWeight: '400',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
  },
  viewDetailsText: {
    color: colors.killarney,
    marginLeft: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: colors.killarney,
  },
  filterText: {
    color: colors.killarney,
  },
  activeFilterText: {
    color: '#fff',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appointmentStudent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.killarney,
  },
  appointmentDetails: {
    marginTop: 10,
  },
  appointmentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  appointmentDetailText: {
    marginLeft: 5,
    color: '#666',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.killarney,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.killarney,
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.killarney,
    marginBottom: 5,
  },
  formControl: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  formControlDisabled: {
    backgroundColor: '#e9ecef',
    color: '#666',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerItem: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  pickerItemActive: {
    backgroundColor: colors.killarney,
  },
  pickerItemText: {
    color: colors.killarney,
  },
  pickerItemTextActive: {
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButtonSecondary: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e9ecef',
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonTextSecondary: {
    color: colors.killarney,
    fontWeight: 'bold',
  },
  modalButtonPrimary: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.killarney,
    alignItems: 'center',
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


