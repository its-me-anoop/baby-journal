import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, differenceInHours, isSameDay, isSameWeek, isSameMonth, isSameYear } from 'date-fns';

const SleepGraph = ({ data, timeRange }) => {
    const sleepData = data
        .filter(entry => entry.type === 'sleep')
        .reduce((acc, entry) => {
            const date = parseISO(entry.createdAt.toDate().toISOString());
            let key;

            switch (timeRange) {
                case 'day':
                    key = format(date, 'HH:mm');
                    break;
                case 'week':
                    key = format(date, 'EEE');
                    break;
                case 'month':
                    key = format(date, 'd');
                    break;
                case 'year':
                    key = format(date, 'MMM');
                    break;
                default:
                    key = format(date, 'EEE');
            }

            const duration = differenceInHours(new Date(entry.endTime), new Date(entry.startTime));
            acc[key] = (acc[key] || 0) + duration;
            return acc;
        }, {});

    const chartData = Object.entries(sleepData).map(([label, hours]) => ({
        label,
        hours: Number(hours.toFixed(2))
    }));

    const getXAxisTickFormatter = () => {
        switch (timeRange) {
            case 'day':
                return (value) => format(parseISO(`2000-01-01T${value}`), 'ha');
            case 'week':
                return (value) => value;
            case 'month':
                return (value) => `${value}`;
            case 'year':
                return (value) => value;
            default:
                return (value) => value;
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sleep Duration</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="label"
                        tickFormatter={getXAxisTickFormatter()}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#8884d8" name="Sleep (hours)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SleepGraph;