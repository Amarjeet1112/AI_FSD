import { useState, useEffect } from 'react';
import { candidateApi } from '../services/api';
import { Users, UserCheck, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await candidateApi.getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const stats = [
    { label: 'Total Candidates', value: candidates.length, icon: <Users className="text-primary" size={32} /> },
    { label: 'Avg Experience', value: candidates.length ? (candidates.reduce((acc, c) => acc + c.experience, 0) / candidates.length).toFixed(1) + 'y' : '0y', icon: <Activity className="text-secondary" size={32} /> },
    { label: 'Recent Additions', value: candidates.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: <UserCheck className="text-success" size={32} /> },
  ];

  // Data for chart
  const expData = [
    { name: '0-2 Yrs', count: candidates.filter(c => c.experience <= 2).length },
    { name: '3-5 Yrs', count: candidates.filter(c => c.experience > 2 && c.experience <= 5).length },
    { name: '6-10 Yrs', count: candidates.filter(c => c.experience > 5 && c.experience <= 10).length },
    { name: '10+ Yrs', count: candidates.filter(c => c.experience > 10).length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-8 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
        System Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
              <p className="text-4xl font-bold mt-2">{loading ? '-' : stat.value}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-full border border-white/10">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card mt-8">
        <h3 className="text-xl font-semibold mb-6 text-primary">Experience Distribution</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: 'rgba(20,20,30,0.9)', borderColor: '#00f0ff', borderRadius: '8px' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {expData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f0ff' : '#bf00ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
