import React from 'react';
import { Input } from '@/components/ui/input';
import { Bell, MessageCircle, PlusCircle, Search } from 'lucide-react';

const TopNav = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex h-full items-center px-6"> {/* Changed from px-4 to px-6 for more space */}
        {/* Logo Section - Added ml-4 for space from left edge */}
        <div className="flex items-center gap-2 w-[240px] ml-4">
          <img src="/src/assets/BarterCove.png" alt="Logo" className="h-10 w-50" />
        </div>

        {/* Search Section */}
        <div className="flex items-center flex-1 justify-center px-4">
          <div className="w-full max-w-2xl flex items-center space-x-2 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute ml-2" />
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="pl-8"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ml-auto flex items-center space-x-4">
          <button className="p-2 hover:bg-accent rounded-full transition-colors group">
            <MessageCircle className="h-5 w-5 text-white group-hover:text-black transition-colors" />
          </button>
          <button className="p-2 hover:bg-accent rounded-full transition-colors group">
            <PlusCircle className="h-5 w-5 text-white group-hover:text-black transition-colors" />
          </button>
          <button className="p-2 hover:bg-accent rounded-full transition-colors group">
            <Bell className="h-5 w-5 text-white group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;