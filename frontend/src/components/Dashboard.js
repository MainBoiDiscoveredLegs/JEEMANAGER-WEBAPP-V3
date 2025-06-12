import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState({});
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch chapters with progress data
      const chaptersResponse = await axios.get('http://localhost:8000/api/chapters/list/', config);
      setChapters(chaptersResponse.data);

      // Fetch user preferences
      const preferencesResponse = await axios.get('http://localhost:8000/api/users/preferences/', config);
      setUserPreferences(preferencesResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (chapterId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Find the progress ID for this chapter
      const progressEntry = chapters.find(ch => ch.id === chapterId);
      if (!progressEntry) return;

      // Update the status
      const response = await axios.patch(
        `http://localhost:8000/api/progress/${progressEntry.id}/update_progress/`,
        { status: newStatus },
        config
      );

      // Update local state
      setChapters(chapters.map(ch => 
        ch.id === chapterId 
          ? { ...ch, status: newStatus }
          : ch
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleHighlightChange = async (chapterId, newColor) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Find the progress ID for this chapter
      const progressEntry = chapters.find(ch => ch.id === chapterId);
      if (!progressEntry) return;

      // Update the highlight color
      const response = await axios.patch(
        `http://localhost:8000/api/progress/${progressEntry.id}/update_highlight/`,
        { highlight_color: newColor },
        config
      );

      // Update local state
      setChapters(chapters.map(ch => 
        ch.id === chapterId 
          ? { ...ch, highlight_color: newColor }
          : ch
      ));
    } catch (error) {
      console.error('Error updating highlight color:', error);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.patch(
        'http://localhost:8000/api/users/preferences/',
        formData,
        config
      );

      setUserPreferences(response.data);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const filteredChapters = chapters.filter(chapter => {
    if (selectedPhase && chapter.phase !== selectedPhase) return false;
    if (selectedSubject && chapter.subject !== selectedSubject) return false;
    return true;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="profile-section">
        <div className="profile-picture">
          {userPreferences?.profile_picture ? (
            <img src={userPreferences.profile_picture} alt="Profile" />
          ) : (
            <div className="default-profile">No Image</div>
          )}
        </div>
        <input
          type="file"
          id="profile-picture-input"
          onChange={handleProfilePictureChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <label htmlFor="profile-picture-input" className="change-pfp-btn">
          Change Profile Picture
        </label>
      </div>

      <div className="filters">
        <select 
          value={selectedPhase} 
          onChange={(e) => setSelectedPhase(e.target.value)}
          className="filter-select"
        >
          <option value="">All Phases</option>
          <option value="Phase 1">Phase 1</option>
          <option value="Phase 2">Phase 2</option>
          <option value="Phase 3">Phase 3</option>
        </select>

        <select 
          value={selectedSubject} 
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="filter-select"
        >
          <option value="">All Subjects</option>
          <option value="Subject 1">Subject 1</option>
          <option value="Subject 2">Subject 2</option>
          <option value="Subject 3">Subject 3</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Phase</th>
              <th>Subject</th>
              <th>Chapter</th>
              <th>Status</th>
              <th>Highlight Color</th>
            </tr>
          </thead>
          <tbody>
            {filteredChapters.map((chapter, index) => (
              <tr key={chapter.id}>
                <td>{index + 1}</td>
                <td>{chapter.phase}</td>
                <td>{chapter.subject}</td>
                <td>{chapter.chapter}</td>
                <td>
                  <input
                    type="text"
                    value={chapter.status || ''}
                    onChange={(e) => handleStatusChange(chapter.id, e.target.value)}
                    onBlur={(e) => handleStatusChange(chapter.id, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="color"
                    value={chapter.highlight_color || '#FFFFFF'}
                    onChange={(e) => handleHighlightChange(chapter.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard; 