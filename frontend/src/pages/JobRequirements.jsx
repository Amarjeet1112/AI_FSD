import { useState } from 'react';
import { candidateApi, aiApi } from '../services/api';
import { Brain, Search, CheckCircle, Zap } from 'lucide-react';

const JobRequirements = () => {
  const [reqs, setReqs] = useState({
    requiredSkills: '',
    preferredSkills: '',
    minimumExperience: '',
  });
  
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Match Results, 3: AI Insights

  const handleMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      requiredSkills: reqs.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      preferredSkills: reqs.preferredSkills.split(',').map(s => s.trim()).filter(s => s),
      minimumExperience: Number(reqs.minimumExperience) || 0
    };

    try {
      const results = await candidateApi.matchCandidates(payload);
      setMatchedCandidates(results);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert('Error calculating match');
    } finally {
      setLoading(false);
    }
  };

  const handleAiShortlist = async () => {
    // Only send High and Medium matches to save tokens
    const shortlist = matchedCandidates.filter(c => c.category !== 'Low Match');
    
    if (shortlist.length === 0) return alert('No strong candidates to analyze.');
    
    setAiLoading(true);
    const payload = {
      requiredSkills: reqs.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      preferredSkills: reqs.preferredSkills.split(',').map(s => s.trim()).filter(s => s),
      minimumExperience: Number(reqs.minimumExperience) || 0
    };

    try {
      const enhancedResults = await aiApi.shortlistCandidates(shortlist, payload);
      
      // Update matched candidates with AI insights
      const updatedList = matchedCandidates.map(c => {
        const enhanced = enhancedResults.find(e => e._id === c._id);
        return enhanced ? { ...c, ...enhanced } : c;
      });
      
      setMatchedCandidates(updatedList);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('AI Analysis failed. Check console.');
    } finally {
      setAiLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-primary';
    return 'text-accent';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8 mb-10">
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary/20 shadow-neon-primary' : 'border-gray-500'}`}>1</div>
          <span className="mt-2 text-sm font-bold uppercase tracking-wider">Define Job</span>
        </div>
        <div className={`w-16 h-1 border-t-2 ${step >= 2 ? 'border-primary' : 'border-gray-500'}`}></div>
        <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary/20 shadow-neon-primary' : 'border-gray-500'}`}>2</div>
          <span className="mt-2 text-sm font-bold uppercase tracking-wider">System Match</span>
        </div>
        <div className={`w-16 h-1 border-t-2 ${step >= 3 ? 'border-secondary' : 'border-gray-500'}`}></div>
        <div className={`flex flex-col items-center ${step >= 3 ? 'text-secondary' : 'text-gray-500'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-secondary bg-secondary/20 shadow-neon-secondary' : 'border-gray-500'}`}>3</div>
          <span className="mt-2 text-sm font-bold uppercase tracking-wider">AI Insights</span>
        </div>
      </div>

      {step === 1 && (
        <div className="glass-card max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
          <h2 className="text-2xl font-bold text-white mb-6">Job Requirements</h2>
          <form onSubmit={handleMatch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-primary font-medium uppercase tracking-wider">Required Skills (Comma separated)</label>
              <input 
                type="text" required
                className="neon-input" 
                placeholder="React, Node.js, MongoDB"
                value={reqs.requiredSkills}
                onChange={e => setReqs({...reqs, requiredSkills: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-primary font-medium uppercase tracking-wider">Preferred Skills (Optional)</label>
              <input 
                type="text" 
                className="neon-input" 
                placeholder="AWS, Docker, GraphQL"
                value={reqs.preferredSkills}
                onChange={e => setReqs({...reqs, preferredSkills: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-primary font-medium uppercase tracking-wider">Minimum Experience (Years)</label>
              <input 
                type="number" required min="0"
                className="neon-input w-1/3" 
                placeholder="e.g. 3"
                value={reqs.minimumExperience}
                onChange={e => setReqs({...reqs, minimumExperience: e.target.value})}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full neon-button py-3 mt-4 flex justify-center items-center gap-2 text-lg">
              {loading ? 'Calculating...' : 'Run System Match'}
              {!loading && <Search size={20} />}
            </button>
          </form>
        </div>
      )}

      {step >= 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-bold text-white">Match Results</h2>
            {step === 2 && (
              <button 
                onClick={handleAiShortlist} 
                disabled={aiLoading}
                className="relative px-6 py-3 bg-secondary/10 text-secondary font-bold uppercase tracking-wider border border-secondary rounded-lg hover:bg-secondary/30 hover:shadow-neon-secondary transition-all flex items-center gap-2"
              >
                {aiLoading ? (
                  <span className="animate-pulse flex items-center gap-2">Processing AI... <Brain className="animate-spin" size={20} /></span>
                ) : (
                  <>Trigger AI Analysis <Brain size={20} /></>
                )}
              </button>
            )}
            {step === 3 && (
              <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white underline">Start New Search</button>
            )}
          </div>

          <div className="space-y-4">
            {matchedCandidates.map((candidate, i) => (
              <div key={candidate._id} className="glass-card relative overflow-hidden flex flex-col md:flex-row gap-6">
                {/* Match Score Indicator */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -z-10"></div>
                
                <div className="w-full md:w-1/3 border-r border-white/10 pr-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{candidate.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{candidate.experience} Years Experience</p>
                  
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase mb-1">Match Score</p>
                    <div className="flex items-end gap-2">
                      <span className={`text-5xl font-black ${getMatchColor(candidate.matchScore)}`}>
                        {candidate.matchScore}%
                      </span>
                      <span className="text-sm text-gray-400 mb-1">{candidate.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-primary uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                      <CheckCircle size={14} /> Matched Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matchedSkills.map(s => (
                        <span key={s} className="px-2 py-1 bg-success/20 text-success border border-success/30 rounded text-xs">
                          {s}
                        </span>
                      ))}
                      {candidate.skills.filter(s => !candidate.matchedSkills.includes(s.toLowerCase())).map(s => (
                        <span key={s} className="px-2 py-1 bg-white/5 text-gray-400 border border-white/10 rounded text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {step === 3 && candidate.category !== 'Low Match' && (
                    <div className="mt-4 p-4 bg-secondary/10 border border-secondary/30 rounded-lg animate-in zoom-in duration-500">
                      <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                        <Zap size={14} /> AI Insight
                      </p>
                      <p className="text-sm text-gray-200 leading-relaxed italic">
                        "{candidate.aiRecommendation || 'Processing...'}"
                      </p>
                      
                      {candidate.interviewQuestions && candidate.interviewQuestions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-secondary/20">
                           <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-2">Suggested Interview Questions:</p>
                           <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                             {candidate.interviewQuestions.map((q, idx) => (
                               <li key={idx}>{q}</li>
                             ))}
                           </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {matchedCandidates.length === 0 && (
              <div className="text-center py-10 text-gray-400 glass-card">
                No candidates evaluated. Try again.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRequirements;
