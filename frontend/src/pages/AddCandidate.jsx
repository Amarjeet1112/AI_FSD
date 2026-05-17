import { useState } from 'react';
import { candidateApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Send, Plus, X } from 'lucide-react';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    bio: '',
  });
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) return alert('Please add at least one skill');
    
    setLoading(true);
    try {
      await candidateApi.addCandidate({
        ...formData,
        experience: Number(formData.experience),
        skills
      });
      navigate('/candidates');
    } catch (error) {
      console.error(error);
      alert('Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-8">Add New Candidate</h2>
      
      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-primary font-medium uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                required
                className="neon-input" 
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-primary font-medium uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                required
                className="neon-input" 
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-primary font-medium uppercase tracking-wider">Experience (Years)</label>
            <input 
              type="number" 
              required min="0" step="0.5"
              className="neon-input w-1/2" 
              placeholder="e.g. 3.5"
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-primary font-medium uppercase tracking-wider">Skills</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                className="neon-input flex-1" 
                placeholder="React, Python, AWS..."
                value={currentSkill}
                onChange={e => setCurrentSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill(e)}
              />
              <button 
                type="button" 
                onClick={handleAddSkill}
                className="neon-button px-4 flex items-center"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-primary/20 border border-primary/50 rounded-full text-sm flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-primary hover:text-white">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-primary font-medium uppercase tracking-wider">Bio / Projects</label>
            <textarea 
              rows="4"
              className="neon-input" 
              placeholder="Brief background or project links..."
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full neon-button flex items-center justify-center gap-2 py-3 mt-4 text-lg"
          >
            {loading ? 'Processing...' : 'Register Candidate'}
            {!loading && <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
