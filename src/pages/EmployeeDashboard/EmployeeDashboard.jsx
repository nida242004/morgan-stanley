import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const EmployeeDashboard = () => {
  const { educatorID } = useParams();
  const [educator, setEducator] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [courseworkTitle, setCourseworkTitle] = useState("");
  const [courseworkDescription, setCourseworkDescription] = useState("");
  const [courseworkItems, setCourseworkItems] = useState([]);
  const [reportContent, setReportContent] = useState("");
  const [reportStudentId, setReportStudentId] = useState("");

  // Color theme
  const colors = {
    primary: "#0077b6", // Ocean blue
    secondary: "#00b4d8",
    light: "#caf0f8",
    dark: "#03045e",
    white: "#ffffff",
    lightGray: "#f8f9fa"
  };

  useEffect(() => {
    // Fetch educator data
    fetch("/public/employees.json")
      .then((res) => res.json())
      .then((data) => {
        const foundEducator = data.find((edu) => edu.educatorID === educatorID);
        setEducator(foundEducator);
        
        if (foundEducator) {
          // Clean up the students assigned string (remove brackets)
          const studentIDs = foundEducator.studentsAssigned
            .replace("[", "")
            .replace("]", "")
            .split(",");
          
          // Fetch students data
          fetch("/public/students.json")
            .then((res) => res.json())
            .then((studentsData) => {
              const assignedStudents = studentsData.filter(student => 
                studentIDs.includes(student.studentID)
              );
              setStudents(assignedStudents);
              setLoading(false);
            })
            .catch(err => console.error("Error fetching students data:", err));
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching educator data:", err);
        setLoading(false);
      });
  }, [educatorID]);

  const handleStudentSelection = (studentID) => {
    if (selectedStudents.includes(studentID)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentID));
    } else {
      setSelectedStudents([...selectedStudents, studentID]);
    }
  };

  const addCourseworkItem = () => {
    const newItem = {
      id: Date.now(),
      content: "",
      duration: "30 mins",
      materials: ""
    };
    setCourseworkItems([...courseworkItems, newItem]);
  };

  const updateCourseworkItem = (id, field, value) => {
    const updated = courseworkItems.map(item => 
      item.id === id ? {...item, [field]: value} : item
    );
    setCourseworkItems(updated);
  };

  const removeCourseworkItem = (id) => {
    setCourseworkItems(courseworkItems.filter(item => item.id !== id));
  };

  const handleSubmitCoursework = () => {
    // In a real application, this would send data to a backend
    alert(`Coursework "${courseworkTitle}" created for ${selectedStudents.length} students with ${courseworkItems.length} activities.`);
    // Reset form
    setCourseworkTitle("");
    setCourseworkDescription("");
    setCourseworkItems([]);
    setSelectedStudents([]);
  };

  const handleSubmitReport = () => {
    // In a real application, this would send data to a backend
    alert(`Report submitted for student ${reportStudentId}`);
    // Reset form
    setReportContent("");
    setReportStudentId("");
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "100vh", backgroundColor: colors.lightGray}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (!educator) return (
    <div className="text-center mt-5" style={{color: colors.dark}}>
      <h3>Educator not found</h3>
      <p>The educator ID {educatorID} does not exist in our records.</p>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container-fluid" style={{minHeight: "100vh", backgroundColor: colors.lightGray, padding: 0}}>
        <div className="row g-0">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2" style={{backgroundColor: colors.primary, minHeight: "100vh", color: colors.white}}>
            <div className="d-flex flex-column p-3">
              <div className="text-center mb-4">
                <img src={educator.photo} alt="Profile" className="rounded-circle border border-3 border-white" style={{width: "100px", height: "100px"}} />
                <h4 className="mt-2">{educator.firstName} {educator.lastName}</h4>
                <p className="small mb-0">{educator.designation}</p>
                <p className="small">{educator.department}</p>
              </div>
              
              <div className="nav flex-column">
                <button 
                  className={`btn text-start py-2 ${activeTab === "profile" ? "bg-white text-primary" : "text-white"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <i className="bi bi-person-circle me-2"></i> Profile
                </button>
                <button 
                  className={`btn text-start py-2 mt-2 ${activeTab === "coursework" ? "bg-white text-primary" : "text-white"}`}
                  onClick={() => setActiveTab("coursework")}
                >
                  <i className="bi bi-book me-2"></i> Plan Coursework
                </button>
                <button 
                  className={`btn text-start py-2 mt-2 ${activeTab === "reports" ? "bg-white text-primary" : "text-white"}`}
                  onClick={() => setActiveTab("reports")}
                >
                  <i className="bi bi-file-text me-2"></i> Reports
                </button>
              </div>
              
              <div className="mt-auto text-center mb-3">
                <p className="small mb-1">Assigned Students: {students.length}</p>
                <button className="btn btn-sm" style={{backgroundColor: colors.light, color: colors.dark}}>
                  View Calendar
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-md-9 col-lg-10 p-4">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="card shadow-sm">
                <div className="card-header" style={{backgroundColor: colors.primary, color: colors.white}}>
                  <h5 className="mb-0">Educator Profile</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-primary">Personal Information</h6>
                      <div className="mb-3">
                        <strong>Name:</strong> {educator.firstName} {educator.lastName}
                      </div>
                      <div className="mb-3">
                        <strong>Gender:</strong> {educator.gender}
                      </div>
                      <div className="mb-3">
                        <strong>Email:</strong> {educator.email}
                      </div>
                      <div className="mb-3">
                        <strong>Contact:</strong> {educator.contact}
                      </div>
                      <div className="mb-3">
                        <strong>Address:</strong> {educator.address}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-primary">Work Information</h6>
                      <div className="mb-3">
                        <strong>ID:</strong> {educator.educatorID}
                      </div>
                      <div className="mb-3">
                        <strong>Designation:</strong> {educator.designation}
                      </div>
                      <div className="mb-3">
                        <strong>Department:</strong> {educator.department}
                      </div>
                      <div className="mb-3">
                        <strong>Employment Type:</strong> {educator.employmentType}
                      </div>
                      <div className="mb-3">
                        <strong>Work Location:</strong> {educator.workLocation}
                      </div>
                      <div className="mb-3">
                        <strong>Date of Joining:</strong> {educator.dateOfJoining}
                      </div>
                      <div className="mb-3">
                        <strong>Tenure:</strong> {educator.tenure}
                      </div>
                      <div className="mb-3">
                        <strong>Programs:</strong> {educator.programs}
                      </div>
                      <div className="mb-3">
                        <strong>Status:</strong> <span className="badge bg-success">{educator.status}</span>
                      </div>
                      {educator.comments && (
                        <div className="mb-3">
                          <strong>Comments:</strong> {educator.comments}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h6 className="text-primary mt-4">Assigned Students</h6>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead style={{backgroundColor: colors.light}}>
                        <tr>
                          <th>Photo</th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Primary Diagnosis</th>
                          <th>Comorbidity</th>
                          <th>Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.studentID}>
                            <td>
                              <img src={student.photo} alt={student.firstName} className="rounded-circle" width="40" height="40" />
                            </td>
                            <td>{student.studentID}</td>
                            <td>{student.firstName} {student.lastName}</td>
                            <td>{student.primaryDiagnosis}</td>
                            <td>{student.comorbidity}</td>
                            <td>{student.phoneNumber}</td>
                            <td>
                              <button className="btn btn-sm" style={{backgroundColor: colors.primary, color: colors.white}}>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Coursework Planning Tab */}
            {activeTab === "coursework" && (
              <div className="card shadow-sm">
                <div className="card-header" style={{backgroundColor: colors.primary, color: colors.white}}>
                  <h5 className="mb-0">Plan Coursework</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <div className="card h-100">
                        <div className="card-header" style={{backgroundColor: colors.light}}>
                          <h6 className="mb-0">Select Students</h6>
                        </div>
                        <div className="card-body" style={{maxHeight: "400px", overflowY: "auto"}}>
                          {students.map(student => (
                            <div className="form-check mb-2" key={student.studentID}>
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id={`student-${student.studentID}`}
                                checked={selectedStudents.includes(student.studentID)}
                                onChange={() => handleStudentSelection(student.studentID)} 
                              />
                              <label className="form-check-label d-flex align-items-center" htmlFor={`student-${student.studentID}`}>
                                <img src={student.photo} alt={student.firstName} className="rounded-circle me-2" width="30" height="30" />
                                {student.firstName} {student.lastName}
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="card-footer bg-white">
                          <small className="text-muted">
                            {selectedStudents.length} students selected
                          </small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-8">
                      <div className="card mb-4">
                        <div className="card-header" style={{backgroundColor: colors.light}}>
                          <h6 className="mb-0">Coursework Details</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label htmlFor="courseworkTitle" className="form-label">Title</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="courseworkTitle"
                              value={courseworkTitle}
                              onChange={(e) => setCourseworkTitle(e.target.value)}
                              placeholder="e.g., Fine Motor Skills Development" 
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="courseworkDescription" className="form-label">Description</label>
                            <textarea 
                              className="form-control" 
                              id="courseworkDescription" 
                              rows="3"
                              value={courseworkDescription}
                              onChange={(e) => setCourseworkDescription(e.target.value)}
                              placeholder="Brief description of the coursework objectives"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: colors.light}}>
                          <h6 className="mb-0">Activities</h6>
                          <button 
                            className="btn btn-sm" 
                            onClick={addCourseworkItem}
                            style={{backgroundColor: colors.primary, color: colors.white}}
                          >
                            <i className="bi bi-plus-circle me-1"></i> Add Activity
                          </button>
                        </div>
                        <div className="card-body">
                          <div style={{maxHeight: "400px", overflowY: "auto"}}>
                            {courseworkItems.length === 0 ? (
                              <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-plus" style={{fontSize: "2rem"}}></i>
                                <p className="mt-2">No activities added yet. Click "Add Activity" to get started.</p>
                              </div>
                            ) : (
                              courseworkItems.map((item, index) => (
                                <div className="card mb-3 border-light" key={item.id}>
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-md-7">
                                        <div className="mb-2">
                                          <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Activity description"
                                            value={item.content}
                                            onChange={(e) => updateCourseworkItem(item.id, "content", e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <select 
                                          className="form-select"
                                          value={item.duration}
                                          onChange={(e) => updateCourseworkItem(item.id, "duration", e.target.value)}
                                        >
                                          <option value="15 mins">15 mins</option>
                                          <option value="30 mins">30 mins</option>
                                          <option value="45 mins">45 mins</option>
                                          <option value="60 mins">60 mins</option>
                                        </select>
                                      </div>
                                      <div className="col-md-2">
                                        <button 
                                          className="btn btn-outline-danger btn-sm w-100"
                                          onClick={() => removeCourseworkItem(item.id)}
                                        >
                                          <i className="bi bi-trash"></i>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <input 
                                        type="text" 
                                        className="form-control form-control-sm" 
                                        placeholder="Materials needed"
                                        value={item.materials}
                                        onChange={(e) => updateCourseworkItem(item.id, "materials", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          
                          {courseworkItems.length > 0 && (
                            <div className="d-grid mt-3">
                              <button 
                                className="btn" 
                                onClick={handleSubmitCoursework}
                                style={{backgroundColor: colors.primary, color: colors.white}}
                              >
                                <i className="bi bi-save me-1"></i> Save Coursework Plan
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="card shadow-sm">
                <div className="card-header" style={{backgroundColor: colors.primary, color: colors.white}}>
                  <h5 className="mb-0">Student Reports</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <div className="card h-100">
                        <div className="card-header" style={{backgroundColor: colors.light}}>
                          <h6 className="mb-0">Select Student</h6>
                        </div>
                        <div className="card-body">
                          <select 
                            className="form-select mb-3"
                            value={reportStudentId}
                            onChange={(e) => setReportStudentId(e.target.value)}
                          >
                            <option value="">-- Select a student --</option>
                            {students.map(student => (
                              <option key={student.studentID} value={student.studentID}>
                                {student.firstName} {student.lastName}
                              </option>
                            ))}
                          </select>
                          
                          {reportStudentId && (
                            <div className="mt-3">
                              <div className="d-flex mb-2">
                                <div className="me-3">
                                  {students.find(s => s.studentID === reportStudentId)?.photo && (
                                    <img 
                                      src={students.find(s => s.studentID === reportStudentId)?.photo} 
                                      alt="Student" 
                                      className="rounded-circle" 
                                      width="60" 
                                      height="60" 
                                    />
                                  )}
                                </div>
                                <div>
                                  <h6>{students.find(s => s.studentID === reportStudentId)?.firstName} {students.find(s => s.studentID === reportStudentId)?.lastName}</h6>
                                  <p className="small text-muted mb-0">ID: {reportStudentId}</p>
                                  <p className="small text-muted mb-0">Diagnosis: {students.find(s => s.studentID === reportStudentId)?.primaryDiagnosis}</p>
                                </div>
                              </div>
                              <hr />
                              <div className="mb-2">
                                <strong>Strengths:</strong> {students.find(s => s.studentID === reportStudentId)?.strengths}
                              </div>
                              <div className="mb-2">
                                <strong>Weaknesses:</strong> {students.find(s => s.studentID === reportStudentId)?.weaknesses}
                              </div>
                              <div className="mb-2">
                                <strong>Comments:</strong> {students.find(s => s.studentID === reportStudentId)?.comments}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-8">
                      <div className="card">
                        <div className="card-header" style={{backgroundColor: colors.light}}>
                          <h6 className="mb-0">Create Report</h6>
                        </div>
                        <div className="card-body">
                          {!reportStudentId ? (
                            <div className="text-center py-5 text-muted">
                              <i className="bi bi-file-earmark-text" style={{fontSize: "3rem"}}></i>
                              <p className="mt-3">Please select a student from the left panel to create a report.</p>
                            </div>
                          ) : (
                            <>
                              <div className="mb-3">
                                <label className="form-label">Report Type</label>
                                <select className="form-select">
                                  <option>Progress Report</option>
                                  <option>Incident Report</option>
                                  <option>Evaluation Report</option>
                                  <option>Monthly Summary</option>
                                </select>
                              </div>
                              
                              <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input type="date" className="form-control" defaultValue={new Date().toISOString().substr(0, 10)} />
                              </div>
                              
                              <div className="mb-3">
                                <label className="form-label">Report Content</label>
                                <textarea 
                                  className="form-control" 
                                  rows="8"
                                  value={reportContent}
                                  onChange={(e) => setReportContent(e.target.value)}
                                  placeholder="Enter detailed report about the student's progress, challenges, achievements, and recommendations..."
                                ></textarea>
                              </div>
                              
                              <div className="mb-3">
                                <label className="form-label">Areas of Focus</label>
                                <div className="d-flex flex-wrap gap-2">
                                  {["Academic", "Behavioral", "Social", "Motor Skills", "Communication", "Cognitive"].map(area => (
                                    <div className="form-check form-check-inline" key={area}>
                                      <input className="form-check-input" type="checkbox" id={`area-${area}`} />
                                      <label className="form-check-label" htmlFor={`area-${area}`}>{area}</label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <label className="form-label">Recommendations</label>
                                <textarea className="form-control" rows="3" placeholder="Provide recommendations for future sessions or activities..."></textarea>
                              </div>
                              
                              <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-outline-secondary">
                                  <i className="bi bi-save me-1"></i> Save as Draft
                                </button>
                                <button 
                                  className="btn" 
                                  style={{backgroundColor: colors.primary, color: colors.white}}
                                  onClick={handleSubmitReport}
                                >
                                  <i className="bi bi-send me-1"></i> Submit Report
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default EmployeeDashboard;