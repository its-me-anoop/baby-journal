import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';

const SleepChart = () => {
    const [sleepData, setSleepData] = useState([]);

    useEffect(() => {
        const fetchSleepData = async () => {
            const start = startOfWeek(new Date());
            const end = endOfWeek(new Date());

            const q = query(
                collection(db, 'journalEntries'),
                where('type', '==', 'sleep'),
                where('startTime', '>=', start),
                where('startTime', '<=', end)
            );

            const querySnapshot = await getDocs(q);
            const fetchedData = querySnapshot.docs.map(doc => doc.data());

            const daysOfWeek = eachDayOfInterval({ start, end });
            const formattedData = daysOfWeek.map(day => {
                const dayEntries = fetchedData.filter(entry =>
                    new Date(entry.startTime).toDateString() === day.toDateString()
                );
                const totalSleep = dayEntries.reduce((sum, entry) =>
                    sum + (new Date(entry.endTime) - new Date(entry.startTime)) / (1000 * 60 * 60), 0
                );
                return {
                    date: format(day, 'EEE'),
                    hours: parseFloat(totalSleep.toFixed(2))
                };
            });

            setSleepData(formattedData);
        };

        fetchSleepData();
    }, []);

    return (
        <div className="w-full h-64">
            <h3 className="text-lg font-semibold mb-4">Sleep Pattern (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#8884d8" name="Sleep Duration (hours)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SleepChart;