import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, Briefcase } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Add Candidate', path: '/add-candidate', icon: <UserPlus size={20} /> },
    { name: 'Candidates', path: '/candidates', icon: <Users size={20} /> },
    { name: 'Job Requirements', path: '/job-requirements', icon: <Briefcase size={20} /> },
  ];

  return (
    <aside className="w-64 bg-surface backdrop-blur-glass border-r border-white/10 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
          AI Nexus Recruiter
        </h1>
      </div>
      
      <nav className="flex-1 px-4 mt-8 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/20 text-primary shadow-neon-primary border border-primary/30' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-white/10 text-center text-xs text-gray-500">
        <p>AI Engine Powered by OpenRouter</p>
        <p className="mt-1 text-primary animate-pulse">System Online</p>
      </div>
    </aside>
  );
};

export default Sidebar;
