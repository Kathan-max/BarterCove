import React from 'react';
import { Input } from "@/components/ui/input";
import { Home, MessageCircle, User, Trophy, PlusCircle, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b p-4 bg-background">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Home className="w-6 h-6 cursor-pointer" />
          <MessageCircle className="w-6 h-6 cursor-pointer" />
          <User className="w-6 h-6 cursor-pointer" />
          <Trophy className="w-6 h-6 cursor-pointer" />
          <PlusCircle className="w-6 h-6 cursor-pointer" />
        </div>
        <div className="flex items-center space-x-2 max-w-sm w-full">
          <Search className="w-5 h-5" />
          <Input type="search" placeholder="Search..." className="w-full" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;