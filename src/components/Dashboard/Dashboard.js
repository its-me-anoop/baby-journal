import React from 'react';
import SleepChart from './SleepChart';
import StatsSummary from './StatsSummary';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <StatsSummary />
            <SleepChart />
        </div>
    );
};

export default Dashboard;