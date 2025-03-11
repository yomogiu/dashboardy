import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ProjectProvider } from './ProjectContext';
import SerDesDashboard from './SerDesDashboard';
import ImportEditPage from './ImportEditPage';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <nav style={{ padding: '16px', backgroundColor: '#0c2340', color: 'white' }}>
          <Link to="/dashboard" style={{ color: 'white', marginRight: '16px', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link to="/import" style={{ color: 'white', textDecoration: 'none' }}>
            Import/Edit
          </Link>
        </nav>
        <Routes>
          <Route path="/dashboard" element={<SerDesDashboard />} />
          <Route path="/import" element={<ImportEditPage />} />
          <Route path="/" element={<SerDesDashboard />} />
        </Routes>
      </Router>
    </ProjectProvider>
  );
}

export default App;