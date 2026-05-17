import { useState, useEffect } from 'react';
import { candidateApi } from '../services/api';
import { Search, Mail, Briefcase, Calendar } from 'lucide-react';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await candidateApi.getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Candidate Database</h2>
        
        <div className="relative w-72">
          <input 
            type="text" 
            placeholder="Search name or skill..." 
            className="neon-input pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-primary/70" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-primary animate-pulse">Loading Database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(candidate => (
            <div key={candidate._id} className="glass-card flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{candidate.name}</h3>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <Mail size={14} className="mr-1" /> {candidate.email}
                  </div>
                </div>
                <div className="bg-primary/20 border border-primary/50 px-2 py-1 rounded text-xs font-bold text-primary">
                  {candidate.experience} YOE
                </div>
              </div>
              
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-2 flex items-center">
                  <Briefcase size={14} className="mr-1" /> Skills
                </div>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 5).map(skill => (
                    <span key={skill} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 5 && (
                    <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded">
                      +{candidate.skills.length - 5}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500 flex items-center justify-between">
                <span className="flex items-center"><Calendar size={12} className="mr-1" /> Added {new Date(candidate.createdAt).toLocaleDateString()}</span>
                <button className="text-primary hover:underline">View Profile</button>
              </div>
            </div>
          ))}
          {filteredCandidates.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No candidates found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
