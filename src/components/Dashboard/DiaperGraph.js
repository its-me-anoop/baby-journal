import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const DiaperGraph = ({ data }) => {
    const diaperData = data
        .filter(entry => entry.type === 'diaper')
        .reduce((acc, entry) => {
            const date = format(parseISO(entry.createdAt.toDate().toISOString()), 'EEE');
            if (!acc[date]) {
                acc[date] = { wet: 0, dirty: 0, both: 0 };
            }
            acc[date][entry.diaperType]++;
            return acc;
        }, {});

    const chartData = Object.entries(diaperData).map(([day, counts]) => ({
        day,
        ...counts
    }));

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Diaper Changes</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="wet" stackId="a" fill="#8884d8" name="Wet" />
                    <Bar dataKey="dirty" stackId="a" fill="#82ca9d" name="Dirty" />
                    <Bar dataKey="both" stackId="a" fill="#ffc658" name="Both" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DiaperGraph;