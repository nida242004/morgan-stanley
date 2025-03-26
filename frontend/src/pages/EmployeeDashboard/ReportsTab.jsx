import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Button, 
  Modal, 
  Alert, 
  Badge,
  Spinner,
  Tabs,
  Tab,
  ListGroup
} from 'react-bootstrap';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const CORS_ORIGIN = 'https://team-5-ishanyaindiafoundation.onrender.com/api/v1';
const GEMINI_API_KEY = import.meta.env.VITE_GENERATIVE_AI_KEY; // Replace with actual API key

const ReportsTab = ({ authToken, colors, navigate }) => {
  // State for managing data
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [skillAreas, setSkillAreas] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [scoreCards, setScoreCards] = useState([]);
  const [filteredScoreCards, setFilteredScoreCards] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [error, setError] = useState(null);

  // State for creating a new score card
  const [newScoreCard, setNewScoreCard] = useState({
    enrollment_id: '',
    skill_area_id: '',
    sub_task_id: '',
    year: new Date().getFullYear(),
    month: '',
    week: '',
    score: '',
    description: ''
  });

  // State for filters
  const [filters, setFilters] = useState({
    skillArea: '',
    month: '',
    year: new Date().getFullYear(),
    week: ''
  });

  // State for modals and loading
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState({
    enrollments: false,
    skillData: false,
    scoreCards: false,
    submitting: false,
    generatingInsights: false
  });

  // Months for selection
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch enrollments on component mount
  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Fetch enrollments
  const fetchEnrollments = async () => {
    try {
      setLoading(prev => ({ ...prev, enrollments: true }));
      const response = await axios.get(`${CORS_ORIGIN}/employee/myEnrollments`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setEnrollments(response.data.data.enrollments);
    } catch (err) {
      setError(`Failed to fetch enrollments: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, enrollments: false }));
    }
  };

  // Fetch skill areas and subtasks when an enrollment is selected
  const fetchSkillData = async (enrollmentId) => {
    try {
      setLoading(prev => ({ ...prev, skillData: true }));
      const response = await axios.get(`${CORS_ORIGIN}/employee/SkilleAreaAndSubtaks/${enrollmentId}`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const { skillAreas, subTasks } = response.data.data;
      setSkillAreas(skillAreas);
      setSubTasks(subTasks);
    } catch (err) {
      setError(`Failed to fetch skill data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, skillData: false }));
    }
  };

  // Fetch score cards for a selected enrollment
  const fetchScoreCards = async (enrollmentId) => {
    try {
      setLoading(prev => ({ ...prev, scoreCards: true }));
      const response = await axios.get(`${CORS_ORIGIN}/employee/ScoreCards/${enrollmentId}`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const fetchedScoreCards = response.data.data.scoreCards;
      setScoreCards(fetchedScoreCards);
      setFilteredScoreCards(fetchedScoreCards);

      // Generate AI insights
      if (fetchedScoreCards.length > 0) {
        await generateAIInsights(fetchedScoreCards);
      }
    } catch (err) {
      setError(`Failed to fetch score cards: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, scoreCards: false }));
    }
  };

  // Generate AI insights using Gemini
  const generateAIInsights = async (scoreCards) => {
    try {
      setLoading(prev => ({ ...prev, generatingInsights: true }));
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Analyze the following student's performance score cards and provide a comprehensive insights report:

JSON Schema for Insights:
{
  "overallPerformance": {
    "score": "string (e.g., 'Excellent', 'Good', 'Needs Improvement')",
    "averageScore": "number",
    "progressTrend": "string (e.g., 'Improving', 'Consistent', 'Declining')"
  },
  "skillAreaBreakdown": [
    {
      "skillArea": "string",
      "averageScore": "number",
      "strengths": "string[]",
      "areasForImprovement": "string[]"
    }
  ],
  "recommendedActions": "string[]",
  "keyObservations": "string[]"
}

Score Cards Data:
${JSON.stringify(scoreCards)}

Generate insights focusing on learning progress, skill development, and personalized recommendations.`;

      const result = await model.generateContent(prompt);
const response = await result.response.text();

// Extract JSON content safely
const match = response.match(/```json\s*([\s\S]*?)\s*```/);

if (!match) {
  throw new Error("No valid JSON found in AI response");
}

const cleanResponse = match[1].trim(); // Extract only JSON part

const insights = JSON.parse(cleanResponse);
setAiInsights(insights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      setError("Failed to generate AI insights");
    } finally {
      setLoading(prev => ({ ...prev, generatingInsights: false }));
    }
  };

  // Handle enrollment selection
  const handleEnrollmentSelect = (enrollmentId) => {
    const selected = enrollments.find(e => e._id === enrollmentId);
    setSelectedEnrollment(selected);
    
    if (selected) {
      fetchSkillData(selected._id);
      fetchScoreCards(selected._id);
    }
  };

  // Submit a new score card
  const handleSubmitScoreCard = async () => {
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      
      const submitData = {
        ...newScoreCard,
        enrollment_id: selectedEnrollment._id,
        score: parseInt(newScoreCard.score),
        week: parseInt(newScoreCard.week)
      };
      
      await axios.post(`${CORS_ORIGIN}/employee/scoreCard`, submitData, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh score cards after submission
      await fetchScoreCards(selectedEnrollment._id);
      
      // Reset form and close modal
      setNewScoreCard({
        enrollment_id: selectedEnrollment._id,
        skill_area_id: '',
        sub_task_id: '',
        year: new Date().getFullYear(),
        month: '',
        week: '',
        score: '',
        description: ''
      });
      setShowModal(false);
    } catch (err) {
      setError(`Failed to submit score card: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  // Apply filters to score cards
  const applyFilters = () => {
    let filtered = [...scoreCards];

    if (filters.skillArea) {
      filtered = filtered.filter(card => card.skill_area_id._id === filters.skillArea);
    }

    if (filters.month) {
      filtered = filtered.filter(card => card.month === filters.month);
    }

    if (filters.year) {
      filtered = filtered.filter(card => card.year === parseInt(filters.year));
    }

    if (filters.week) {
      filtered = filtered.filter(card => card.week === parseInt(filters.week));
    }

    setFilteredScoreCards(filtered);
  };

  // Render methods
  const renderEnrollmentSelector = () => (
    <Form.Group className="mb-4">
      <Form.Select 
        onChange={(e) => handleEnrollmentSelect(e.target.value)}
        disabled={loading.enrollments}
      >
        <option>Select a Student</option>
        {enrollments.map(enrollment => (
          <option key={enrollment._id} value={enrollment._id}>
            {enrollment.student.firstName} {enrollment.student.lastName} 
            ({enrollment.student.studentID}) - {enrollment.programs.map(p => p.name).join(', ')}
          </option>
        ))}
      </Form.Select>
      {loading.enrollments && <Spinner size="sm" animation="border" className="ms-2" />}
    </Form.Group>
  );

  const renderScoreCardModal = () => (
    <Modal 
      show={showModal} 
      onHide={() => setShowModal(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Score Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="quick" className="mb-3">
          <Tab eventKey="quick" title="Quick Entry">
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Skill Area & Sub Task</Form.Label>
                  <Row>
                    <Col md={6}>
                      <Form.Select
                        value={newScoreCard.skill_area_id}
                        onChange={(e) => {
                          const selectedSkillArea = skillAreas.find(area => area._id === e.target.value);
                          setNewScoreCard(prev => ({
                            ...prev,
                            skill_area_id: e.target.value,
                            sub_task_id: selectedSkillArea?.subTasks?.[0]?._id || ''
                          }));
                        }}
                      >
                        <option value="">Select Skill Area</option>
                        {skillAreas.map(area => (
                          <option key={area._id} value={area._id}>
                            {area.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={6}>
                      <Form.Select
                        value={newScoreCard.sub_task_id}
                        onChange={(e) => setNewScoreCard(prev => ({
                          ...prev,
                          sub_task_id: e.target.value
                        }))}
                        disabled={!newScoreCard.skill_area_id}
                      >
                        <option value="">Select Sub Task</option>
                        {subTasks
                          .filter(st => st.skill_area_id === newScoreCard.skill_area_id)
                          .map(subTask => (
                            <option key={subTask._id} value={subTask._id}>
                              {subTask.name}
                            </option>
                          ))
                        }
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Control 
                    as="select"
                    value={newScoreCard.year}
                    onChange={(e) => setNewScoreCard(prev => ({
                      ...prev,
                      year: parseInt(e.target.value)
                    }))}
                  >
                    {[2023, 2024, 2025].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Control 
                    as="select"
                    value={newScoreCard.month}
                    onChange={(e) => setNewScoreCard(prev => ({
                      ...prev,
                      month: e.target.value
                    }))}
                  >
                    <option value="">Select Month</option>
                    {MONTHS.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Week</Form.Label>
                  <Form.Control 
                    as="select"
                    value={newScoreCard.week}
                    onChange={(e) => setNewScoreCard(prev => ({
                      ...prev,
                      week: parseInt(e.target.value)
                    }))}
                  >
                    <option value="">Select Week</option>
                    {[1, 2, 3, 4, 5].map(week => (
                      <option key={week} value={week}>{week}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Score</Form.Label>
                  <Form.Control 
                    as="select"
                    value={newScoreCard.score}
                    onChange={(e) => setNewScoreCard(prev => ({
                      ...prev,
                      score: parseInt(e.target.value)
                    }))}
                  >
                    <option value="">Select Score</option>
                    {[1, 2, 3, 4, 5].map(score => (
                      <option key={score} value={score}>{score}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newScoreCard.description}
                onChange={(e) => setNewScoreCard(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Brief performance notes"
              />
            </Form.Group>
          </Tab>
          <Tab eventKey="advanced" title="Advanced Entry">
            {/* More detailed form can be added here if needed */}
            <Alert variant="info">Advanced entry form coming soon</Alert>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmitScoreCard}
          disabled={
            loading.submitting || 
            !newScoreCard.skill_area_id || 
            !newScoreCard.sub_task_id || 
            !newScoreCard.month || 
            !newScoreCard.week || 
            !newScoreCard.score
          }
        >
          {loading.submitting ? (
            <>
              <Spinner as="span" size="sm" animation="border" role="status" />
              <span className="ms-2">Submitting...</span>
            </>
          ) : 'Submit Score Card'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderScoreCards = () => (
    <Card className="mb-4">
      <Card.Header>
        <Row className="align-items-center">
          <Col md={3}>
            <Form.Select 
              value={filters.skillArea}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, skillArea: e.target.value }));
                applyFilters();
              }}
              disabled={loading.scoreCards}
            >
              <option value="">All Skill Areas</option>
              {[...new Set(scoreCards.map(card => card.skill_area_id?._id))]
                .filter(Boolean)
                .map(skillAreaId => {
                  const skillArea = scoreCards.find(card => card.skill_area_id?._id === skillAreaId)?.skill_area_id;
                  return (
                    <option key={skillAreaId} value={skillAreaId}>
                      {skillArea?.name}
                    </option>
                  );
                })
              }
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={filters.year}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, year: parseInt(e.target.value) }));
                applyFilters();
              }}
            >
              <option value="">All Years</option>
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={filters.month}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, month: e.target.value }));
                applyFilters();
              }}
            >
              <option value="">All Months</option>
              {MONTHS.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={filters.week}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, week: parseInt(e.target.value) }));
                applyFilters();
              }}
            >
              <option value="">All Weeks</option>
              {[1, 2, 3, 4, 5].map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button 
              variant="outline-primary" 
              onClick={() => setShowModal(true)}
              disabled={loading.skillData}
            >
              Create New Score Card
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {loading.scoreCards ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading score cards...</p>
          </div>
        ) : filteredScoreCards.length === 0 ? (
          <Alert variant="info" className="text-center">
            {scoreCards.length === 0 ? 
              "No score cards found for this student" : 
              "No score cards match the current filters"}
          </Alert>
        ) : (
          <ListGroup variant="flush">
            {filteredScoreCards.map(card => (
              <ListGroup.Item key={card._id}>
                <Row className="align-items-center">
                  <Col md={3}>
                    <strong>{card.skill_area_id?.name}</strong>
                    <div className="text-muted small">{card.sub_task_id?.name}</div>
                  </Col>
                  <Col md={2}>
                    <Badge 
                      bg={
                        card.score >= 4 ? 'success' : 
                        card.score >= 3 ? 'warning' : 
                        'danger'
                      }
                      className="fs-6"
                    >
                      {card.score}/5
                    </Badge>
                  </Col>
                  <Col md={3}>
                    {card.month} Week {card.week}, {card.year}
                  </Col>
                  <Col md={4}>
                    {card.description && (
                      <div className="text-truncate" title={card.description}>
                        {card.description}
                      </div>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );

  const renderAIInsights = () => {
    if (loading.generatingInsights) {
      return (
        <Card className="mb-4">
          <Card.Header>AI Performance Insights</Card.Header>
          <Card.Body className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Generating insights...</p>
          </Card.Body>
        </Card>
      );
    }

    if (!aiInsights || filteredScoreCards.length === 0) return null;

    return (
      <Card className="mb-4">
        <Card.Header>AI Performance Insights</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>Overall Performance</h5>
              <div className="mb-3">
                <strong>Score:</strong> <Badge bg="info">{aiInsights.overallPerformance?.score}</Badge>
                <br />
                <strong>Average Score:</strong> {aiInsights.overallPerformance?.averageScore?.toFixed(1) || 'N/A'}/5
                <br />
                <strong>Progress Trend:</strong> {aiInsights.overallPerformance?.progressTrend}
              </div>
              
              <h5>Key Observations</h5>
              <ul>
                {aiInsights.keyObservations?.map((observation, i) => (
                  <li key={i}>{observation}</li>
                ))}
              </ul>
            </Col>
            <Col md={6}>
              <h5>Recommended Actions</h5>
              <ListGroup variant="flush">
                {aiInsights.recommendedActions?.map((action, index) => (
                  <ListGroup.Item key={index}>{action}</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
          
          <h5 className="mt-4">Skill Area Breakdown</h5>
          <Row>
            {aiInsights.skillAreaBreakdown?.map((area, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card>
                  <Card.Header>
                    <strong>{area.skillArea}</strong> (Avg: {area.averageScore?.toFixed(1)}/5)
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col>
                        <h6>Strengths</h6>
                        <ul>
                          {area.strengths?.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </Col>
                      <Col>
                        <h6>Areas for Improvement</h6>
                        <ul>
                          {area.areasForImprovement?.map((area, i) => (
                            <li key={i}>{area}</li>
                          ))}
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h4 className="mb-4" style={{ color: colors?.killarney || 'green' }}>
          Student Score Cards
        </h4>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {renderEnrollmentSelector()}

        {selectedEnrollment && (
          <>
            {renderScoreCards()}
            {renderAIInsights()}
          </>
        )}
        
        {renderScoreCardModal()}
      </Card.Body>
    </Card>
  );
};

export default ReportsTab;