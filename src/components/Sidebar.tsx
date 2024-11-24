import React from 'react';
import { Home, MessageSquare, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useLocation } from 'react-router-dom';

interface SideNavProps{
  currentPath: string;
  onNavigate: (path: string) => void;
  onMessageClick: ()=> void;
}

const SideNav = ({ currentPath, onNavigate, onMessageClick }: SideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: MessageSquare, label: 'Messages', path: '/messages', onClick: onMessageClick },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  ];

  const handleClick = (item: typeof menuItems[0]) => {
    if (item.onClick){
      item.onClick();
    }
    else{
      onNavigate(item.path);
    }
  };

  return (
    <div className="hidden lg:flex h-[calc(100vh-64px)] w-[240px] flex-col fixed left-0 top-16 border-r bg-background">
      <div className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-sm group transition-colors text-white hover:text-black
              ${location.pathname === item.path ? 'bg-accent text-black' : ''}`}
          >
            <item.icon className={`h-5 w-5 transition-colors
                ${location.pathname === item.path 
                  ? 'text-black' 
                  : 'text-white group-hover:text-black'}`}  />
            <span className="transition-colors">{item.label}</span>
          </button>
          );
      })}
      </div>
    </div>
  );
};

export { SideNav };
