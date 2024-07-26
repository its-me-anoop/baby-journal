import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const FeedingGraph = ({ data }) => {
    const feedingData = data
        .filter(entry => entry.type === 'feeding')
        .reduce((acc, entry) => {
            const date = format(parseISO(entry.createdAt.toDate().toISOString()), 'EEE');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

    const chartData = Object.entries(feedingData).map(([day, count]) => ({
        day,
        count
    }));

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Feedings Per Day</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Feedings" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FeedingGraph;