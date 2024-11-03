import React from 'react';
import { Home, MessageSquare, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const SideNav = () => {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <div className="hidden lg:flex h-[calc(100vh-64px)] w-[240px] flex-col fixed left-0 top-16 border-r bg-background">
      <div className="flex flex-col gap-2 p-4">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-sm group transition-colors text-white hover:text-black"
          >
            <item.icon className="h-5 w-5 text-white group-hover:text-black transition-colors" />
            <span className="transition-colors">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export { SideNav };
