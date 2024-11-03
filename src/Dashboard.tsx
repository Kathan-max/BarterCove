import React from 'react';
import TopNav from './components/TopNav';
import { SideNav } from './components/Sidebar';
import ProductGrid from './components/ProductGrid';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <SideNav />
      
      {/* Main Content - Added pt-16 to account for fixed top nav */}
      <main className="lg:pl-[240px] pt-16">
        <div className="max-w-7xl mx-auto p-6"> {/* Changed from p-4 to p-6 for consistency */}
          <ProductGrid />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;