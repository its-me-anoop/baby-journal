import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const ActivityGraph = ({ data }) => {
    const activityData = data
        .filter(entry => entry.type === 'activity')
        .map(entry => ({
            day: format(parseISO(entry.createdAt.toDate().toISOString()), 'EEE'),
            duration: Number(entry.duration),
            activityType: entry.activityType
        }));

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Activities</h2>
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" name="Day" />
                    <YAxis dataKey="duration" name="Duration (minutes)" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Activities" data={activityData} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityGraph;