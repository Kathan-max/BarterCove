import React from "react";

const Dashboard: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl">Welcome to the Dashboard</h1>
            <p>THis is a protected area accessible after logging in.</p>
        </div>
    );
};

export default Dashboard;