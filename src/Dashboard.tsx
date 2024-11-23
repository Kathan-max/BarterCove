import React, { useState } from 'react';
import TopNav from './components/TopNav';
import { SideNav } from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import MessagingWidget from './components/MessagingWidget';

const Dashboard = () => {
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <SideNav 
        currentPath="/dashboard"
        onNavigate={() => {}}  // empty function if you're not using navigation yet
        onMessageClick={() => setIsMessagingOpen(prev => !prev)}
      />
      
      {/* Main Content - Added pt-16 to account for fixed top nav */}
      <main className="lg:pl-[240px] pt-16">
        <div className="max-w-7xl mx-auto p-6"> {/* Changed from p-4 to p-6 for consistency */}
          <ProductGrid />
        </div>
      </main>
      {/* Change this so that the id is take from the Firebase auth or the MongoDB compass okay!! */}
      {isMessagingOpen && <MessagingWidget userId="1" onClose={() => setIsMessagingOpen(false)} />} 
    </div>
  );
};

export default Dashboard;