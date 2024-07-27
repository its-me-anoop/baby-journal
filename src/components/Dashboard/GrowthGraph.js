import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const GrowthGraph = ({ data, timeRange }) => {
    // Check if data is undefined or null
    if (!data || !Array.isArray(data)) {
        console.error('Invalid data provided to GrowthGraph:', data);
        return <div>No growth data available</div>;
    }

    const getDateFormat = (range) => {
        switch (range) {
            case 'day':
                return 'HH:mm';
            case 'week':
                return 'EEE';
            case 'month':
                return 'dd';
            case 'year':
                return 'MMM';
            default:
                return 'yyyy-MM-dd';
        }
    };

    const growthData = data
        .filter(entry => {
            if (!entry || typeof entry !== 'object') {
                console.warn('Invalid entry in data:', entry);
                return false;
            }
            return entry.type === 'growth' && entry.measurementDate;
        })
        .map(entry => {
            try {
                const date = new Date(entry.measurementDate);
                if (isNaN(date.getTime())) {
                    console.warn('Invalid date in entry:', entry.measurementDate);
                    return null;
                }
                return {
                    date: format(date, getDateFormat(timeRange)),
                    weight: entry.weight ? parseFloat(entry.weight) : null,
                    height: entry.height ? parseFloat(entry.height) : null,
                    headCircumference: entry.headCircumference ? parseFloat(entry.headCircumference) : null
                };
            } catch (error) {
                console.error('Error processing entry:', entry, error);
                return null;
            }
        })
        .filter(Boolean) // Remove any null entries
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // If there's no growth data after filtering, return early
    if (growthData.length === 0) {
        return <div>No valid growth data available for the selected time range</div>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Growth Measurements</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
                    <Line yAxisId="left" type="monotone" dataKey="height" stroke="#82ca9d" name="Height (cm)" />
                    <Line yAxisId="right" type="monotone" dataKey="headCircumference" stroke="#ffc658" name="Head (cm)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GrowthGraph;