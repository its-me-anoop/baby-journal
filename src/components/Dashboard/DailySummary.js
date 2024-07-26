import React from 'react';
import { startOfDay, endOfDay } from 'date-fns';

const DailySummary = ({ data }) => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const todayData = data.filter(entry => {
        const entryDate = entry.createdAt.toDate();
        return entryDate >= todayStart && entryDate <= todayEnd;
    });

    const summary = {
        sleep: 0,
        feedings: 0,
        diapers: 0,
        activities: 0
    };

    todayData.forEach(entry => {
        switch (entry.type) {
            case 'sleep':
                summary.sleep += (new Date(entry.endTime) - new Date(entry.startTime)) / (1000 * 60 * 60);
                break;
            case 'feeding':
                summary.feedings++;
                break;
            case 'diaper':
                summary.diapers++;
                break;
            case 'activity':
                summary.activities++;
                break;
            default:
                break;
        }
    });

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Sleep</h3>
                <p className="text-2xl font-bold">{summary.sleep.toFixed(2)} hours</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Feedings</h3>
                <p className="text-2xl font-bold">{summary.feedings}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Diapers</h3>
                <p className="text-2xl font-bold">{summary.diapers}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Activities</h3>
                <p className="text-2xl font-bold">{summary.activities}</p>
            </div>
        </div>
    );
};

export default DailySummary;