import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Button, 
  Modal, 
  Alert, 
  Badge,
  Accordion,
  ListGroup
} from 'react-bootstrap';
import axios from 'axios';

const ReportsTab = ({ students, colors, authToken, navigate }) => {
  // Hardcoded skill areas and subtasks (as per your original code)
  const [skillAreas] = useState([
    {
      "_id": "67e1b441c6e864f55241a801",
      "program_id": "program1", // This will match with enrolled programs
      "name": "Cognitive Skills",
      "description": "Develops problem-solving, memory retention, and pattern recognition abilities."
    },
    {
      "_id": "67e1b441c6e864f55241a802",
      "program_id": "program1",
      "name": "Communication Skills",
      "description": "Enhances verbal, written, and listening skills for effective expression."
    },
    {
      "_id": "67e1b441c6e864f55241a803",
      "program_id": "program1",
      "name": "Logical Reasoning",
      "description": "Focuses on deductive reasoning, critical thinking, and analytical skills."
    }
  ]);

  const [subTasks] = useState([
    {
      "_id": "67e1b4f3e4099684419bc403",
      "skill_area_id": "67e1b441c6e864f55241a801",
      "name": "Problem Solving",
      "description": "Enhances the ability to analyze and find solutions efficiently."
    },
    {
      "_id": "67e1b4f3e4099684419bc404",
      "skill_area_id": "67e1b441c6e864f55241a801",
      "name": "Critical Thinking",
      "description": "Develops logical reasoning and decision-making skills."
    },
    {
      "_id": "67e1b500e4099684419bc405",
      "skill_area_id": "67e1b441c6e864f55241a802",
      "name": "Verbal Communication",
      "description": "Ability to articulate thoughts clearly and effectively in conversations."
    },
    {
      "_id": "67e1b500e4099684419bc406",
      "skill_area_id": "67e1b441c6e864f55241a802",
      "name": "Active Listening",
      "description": "Focuses on understanding and processing spoken information effectively."
    },
    {
      "_id": "67e1b50be4099684419bc407",
      "skill_area_id": "67e1b441c6e864f55241a803",
      "name": "Deductive Reasoning",
      "description": "Ability to apply general rules to specific problems to reach logical conclusions."
    },
    {
      "_id": "67e1b50be4099684419bc408",
      "skill_area_id": "67e1b441c6e864f55241a803",
      "name": "Critical Thinking",
      "description": "Analyzing information objectively and making reasoned judgments."
    }
  ]);

  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [reports, setReports] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [reportData, setReportData] = useState({
    reportDate: '',
    weekNumber: '',
    categories: []
  });
  const [loading, setLoading] = useState({
    reports: false,
    submit: false
  });
  const [error, setError] = useState(null);

  const fetchReports = async (enrollmentId) => {
    try {
      setLoading(prev => ({ ...prev, reports: true }));
      
      const response = await axios.get(
        `https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/report/${enrollmentId}`,
        {
          headers: { 
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setReports(response.data.reports || []);
    } catch (err) {
      console.error('Fetching reports failed:', err);
      setError(`Failed to fetch reports: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, reports: false }));
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedEnrollment) {
      setError('No student selected');
      return;
    }

    try {
      const payload = {
        enrollmentId: selectedEnrollment._id,
        reportDate: reportData.reportDate,
        weekNumber: parseInt(reportData.weekNumber),
        categories: reportData.categories
          .filter(category => 
            category.subTasks.some(subTask => 
              subTask.score > 0 && subTask.description.trim() !== ''
            )
          )
          .map(category => ({
            categoryId: category.categoryId,
            subTasks: category.subTasks
              .filter(subTask => subTask.score > 0 && subTask.description.trim() !== '')
              .map(subTask => ({
                subTaskId: subTask.subTaskId,
                score: parseInt(subTask.score),
                description: subTask.description.trim(),
                month: subTask.month || new Date().toLocaleString('default', { month: 'long' })
              }))
          }))
      };

      setLoading(prev => ({ ...prev, submit: true }));
      
      await axios.post(
        `https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/uploadReport`,
        payload,
        {
          headers: { 
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      await fetchReports(selectedEnrollment._id);
      setModalType(null);
      setReportData({
        reportDate: '',
        weekNumber: '',
        categories: []
      });
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(`Failed to submit report: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };


  const handleCategoryChange = (categoryId, subTaskId, field, value) => {
    setReportData(prev => {
      const newCategories = [...prev.categories];
      
      // Find or create the category
      let categoryIndex = newCategories.findIndex(c => c.categoryId === categoryId);
      if (categoryIndex === -1) {
        newCategories.push({
          categoryId,
          subTasks: []
        });
        categoryIndex = newCategories.length - 1;
      }
      
      // Find or create the subtask
      const subTaskIndex = newCategories[categoryIndex].subTasks.findIndex(
        st => st.subTaskId === subTaskId
      );
      
      if (subTaskIndex === -1) {
        newCategories[categoryIndex].subTasks.push({
          subTaskId,
          score: 0,
          description: '',
          month: new Date().toLocaleString('default', { month: 'long' })
        });
      }
      
      // Update the field
      if (field === 'score') {
        newCategories[categoryIndex].subTasks = newCategories[categoryIndex].subTasks.map(st => 
          st.subTaskId === subTaskId ? { ...st, score: parseInt(value) } : st
        );
      } else {
        newCategories[categoryIndex].subTasks = newCategories[categoryIndex].subTasks.map(st => 
          st.subTaskId === subTaskId ? { ...st, [field]: value } : st
        );
      }
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  const getSubTaskScore = (categoryId, subTaskId) => {
    const category = reportData.categories.find(c => c.categoryId === categoryId);
    if (!category) return 0;
    
    const subTask = category.subTasks.find(st => st.subTaskId === subTaskId);
    return subTask ? subTask.score : 0;
  };

  const getSubTaskDescription = (categoryId, subTaskId) => {
    const category = reportData.categories.find(c => c.categoryId === categoryId);
    if (!category) return '';
    
    const subTask = category.subTasks.find(st => st.subTaskId === subTaskId);
    return subTask ? subTask.description : '';
  };

  const getSkillAreaName = (id) => {
  return skillAreas.find(sa => sa._id === id)?.name || 'Unknown Skill';
};

const getSubTaskName = (id) => {
  return subTasks.find(st => st._id === id)?.name || 'Unknown Task';
};

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h4 className="mb-4" style={{ color: colors.killarney }}>
          Student Reports
        </h4>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <Form.Group className="mb-4">
          <Form.Select 
            onChange={(e) => {
              const enrollment = students.find(s => s._id === e.target.value);
              setSelectedEnrollment(enrollment);
              if (enrollment) fetchReports(enrollment._id);
            }}
          >
            <option>Select a Student</option>
            {students.map(enrollment => (
              <option key={enrollment._id} value={enrollment._id}>
                {enrollment.student.firstName} {enrollment.student.lastName} 
                ({enrollment.student.studentID}) - Programs: {enrollment.programs.map(p => p.name).join(', ')}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {loading.reports && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {selectedEnrollment && !loading.reports && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>
                Reports for {selectedEnrollment.student.firstName}{' '}
                {selectedEnrollment.student.lastName}
              </h5>
              <Button 
                variant="outline-primary" 
                onClick={() => setModalType('create')}
              >
                Create New Report
              </Button>
            </div>

            {reports.length === 0 ? (
              <Alert variant="info">No reports found for this student</Alert>
            ) : (
              <Row>
                {reports.map(report => (
                  <Col md={6} key={report._id} className="mb-3">
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-3">
                          <h6>Week {report.weekNumber}</h6>
                          <Badge bg="info">{new Date(report.reportDate).toLocaleDateString()}</Badge>
                        </div>
                        
                        <Accordion>
                          {report.categories.map((category, catIdx) => (
                            <Accordion.Item key={catIdx} eventKey={catIdx.toString()}>
                              <Accordion.Header>
                                {getSkillAreaName(category.categoryId)}
                              </Accordion.Header>
                              <Accordion.Body>
                                <ListGroup variant="flush">
                                  {category.subTasks.map((subTask, taskIdx) => (
                                    <ListGroup.Item key={taskIdx}>
                                      <div className="d-flex justify-content-between">
                                        <strong>{getSubTaskName(subTask.subTaskId)}</strong>
                                        <Badge bg="primary">Score: {subTask.score}</Badge>
                                      </div>
                                      <div className="mt-2">
                                        <small className="text-muted">Month: {subTask.month}</small>
                                        <p className="mt-1">{subTask.description}</p>
                                      </div>
                                    </ListGroup.Item>
                                  ))}
                                </ListGroup>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}

        {/* Create Report Modal */}
        <Modal 
          show={modalType === 'create'} 
          onHide={() => setModalType(null)}
          size="lg"
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Report Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={reportData.reportDate}
                      onChange={(e) => setReportData({
                        ...reportData, 
                        reportDate: e.target.value
                      })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Week Number</Form.Label>
                    <Form.Control 
                      type="number" 
                      value={reportData.weekNumber}
                      onChange={(e) => setReportData({
                        ...reportData, 
                        weekNumber: e.target.value
                      })}
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h5 className="mb-3">Skill Assessments</h5>
              
              <Accordion defaultActiveKey={skillAreas.map((_, i) => i.toString())}>
                  {skillAreas.map((skillArea, skillIdx) => (
                   <Accordion.Item key={skillIdx} eventKey={skillIdx.toString()}>
                     <Accordion.Header>{skillArea.name}</Accordion.Header>
                      <Accordion.Body>
                       <p className="text-muted small mb-3">{skillArea.description}</p>
        
                       {subTasks
                          .filter(st => st.skill_area_id === skillArea._id)
                          .map(subTask => (
                          <div key={subTask._id} className="mb-4 p-3 border rounded">
                            <h6>{subTask.name}</h6>
                            <p className="small text-muted">{subTask.description}</p>
                            
                            <Form.Group className="mb-3">
                              <Form.Label>Score (1-5)</Form.Label>
                              <Form.Select
                                value={getSubTaskScore(skillArea._id, subTask._id)}
                                onChange={(e) => handleCategoryChange(
                                  skillArea._id, 
                                  subTask._id, 
                                  'score', 
                                  e.target.value
                                )}
                                required
                              >
                                <option value="0">Select score</option>
                                {[1, 2, 3, 4, 5].map(num => (
                                  <option key={num} value={num}>{num}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            
                            <Form.Group>
                              <Form.Label>Comments</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                value={getSubTaskDescription(skillArea._id, subTask._id)}
                                onChange={(e) => handleCategoryChange(
                                  skillArea._id, 
                                  subTask._id, 
                                  'description', 
                                  e.target.value
                                )}
                                required
                              />
                            </Form.Group>
                          </div>
                        ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmitReport}
              disabled={loading.submit || !reportData.reportDate || !reportData.weekNumber}
            >
              {loading.submit ? 'Submitting...' : 'Submit Report'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default ReportsTab;