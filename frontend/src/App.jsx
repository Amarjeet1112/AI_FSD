import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddCandidate from './pages/AddCandidate';
import CandidateList from './pages/CandidateList';
import JobRequirements from './pages/JobRequirements';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-background text-white">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* Top ambient glow */}
          <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/candidates" element={<CandidateList />} />
              <Route path="/job-requirements" element={<JobRequirements />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
