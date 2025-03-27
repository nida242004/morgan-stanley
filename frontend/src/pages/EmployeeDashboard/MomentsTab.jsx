import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  Form, 
  Button, 
  Alert, 
  Row, 
  Col 
} from 'react-bootstrap';

const MomentsTab = ({ students, colors, authToken, navigate }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [moments, setMoments] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    try {
      const response = await axios.get(
        'https://team-5-ishanyaindiafoundation.onrender.com/api/v1/momentofday',
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      if (response.data && response.data.data && response.data.data.momentOfDay) {
        setMoments(response.data.data.momentOfDay);
      }
    } catch (error) {
      console.error('Error fetching moments:', error);
      
      // Handle unauthorized errors
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/signin');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file type and size
    if (file) {
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      const maxSize = 50 * 1024 * 1024; // 50 MB

      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid video file (MP4, MOV, AVI)');
        return;
      }

      if (file.size > maxSize) {
        setError('Video file must be less than 50 MB');
        return;
      }

      setVideoFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    if (!videoFile) {
      setError('Please upload a video');
      return;
    }

    if (!caption.trim()) {
      setError('Please add a caption');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('studentId', selectedStudent);
    formData.append('moment', videoFile);
    formData.append('caption', caption);

    try {
      setIsUploading(true);
      setError('');
      setSuccess('');

      const response = await axios.post(
        'https://team-5-ishanyaindiafoundation.onrender.com/api/v1/employee/MomentOfDay',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Refresh moments after successful upload
      fetchMoments();

      // Reset form
      setSelectedStudent('');
      setVideoFile(null);
      setCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setSuccess('Moment uploaded successfully!');
    } catch (error) {
      console.error('Error uploading moment:', error);
      
      // Handle unauthorized errors
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/signin');
        return;
      }

      setError(error.response?.data?.message || 'Failed to upload moment. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h4 className="mb-4" style={{ color: colors.killarney }}>
            <i className="bi bi-camera-video me-2"></i> Upload Moments of the Day
          </h4>

          {error && (
            <Alert 
              variant="danger" 
              onClose={() => setError('')} 
              dismissible
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              variant="success" 
              onClose={() => setSuccess('')} 
              dismissible
            >
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Student</Form.Label>
                  <Form.Select 
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Choose a student</option>
                    {students.map((enrollment) => (
                      <option 
                        key={enrollment.student._id} 
                        value={enrollment.student._id}
                      >
                        {enrollment.student.firstName} {enrollment.student.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Video</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {videoFile && (
                    <small className="text-muted">
                      Selected: {videoFile.name} ({Math.round(videoFile.size / 1024 / 1024)} MB)
                    </small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Share a brief description of this moment..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </Form.Group>

            <Button 
              type="submit" 
              disabled={isUploading}
              style={{ 
                backgroundColor: colors.goldenGrass, 
                borderColor: colors.goldenGrass 
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload Moment'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h4 className="mb-4" style={{ color: colors.killarney }}>
            <i className="bi bi-film me-2"></i> Moments of the Day
          </h4>

          {moments.length === 0 ? (
            <p className="text-muted text-center">No moments uploaded yet.</p>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {moments.map((moment) => (
                <Col key={moment._id}>
                  <Card className="h-100">
                    <video 
                      src={moment.publicUrl} 
                      controls 
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                    <Card.Body>
                      <Card.Text>
                        <strong>Caption:</strong> {moment.caption || 'No caption'}
                      </Card.Text>
                      <Card.Text className="text-muted">
                        <small>
                          <i className="bi bi-calendar me-1"></i>
                          {formatDate(moment.date)}
                        </small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default MomentsTab;