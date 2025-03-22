import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, Mic, Calendar } from 'lucide-react';
import { Logo } from './Logo';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <Logo />
      </div>

      <nav className="space-y-2">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
            location.pathname === '/'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/leads"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
            location.pathname.includes('/leads')
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Leads</span>
        </Link>
        <Link
          to="/calendar"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
            location.pathname === '/calendar'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </Link>
        <Link
          to="/ai-sidekick"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
            location.pathname === '/ai-sidekick'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Mic className="w-5 h-5" />
          <span>AI Sidekick</span>
        </Link>
      </nav>
    </aside>
  );
};