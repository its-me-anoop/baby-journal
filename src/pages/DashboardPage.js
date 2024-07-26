import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subMonths, subYears } from 'date-fns';
import SleepGraph from '../components/Dashboard/SleepGraph';
import FeedingGraph from '../components/Dashboard/FeedingGraph';
import DiaperGraph from '../components/Dashboard/DiaperGraph';
import ActivityGraph from '../components/Dashboard/ActivityGraph';
import DailySummary from '../components/Dashboard/DailySummary';

const DashboardPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        setLoading(true);
        const { start, end } = getDateRange();
        const q = query(
            collection(db, 'journalEntries'),
            where('createdBy', '==', auth.currentUser.uid),
            where('createdAt', '>=', start),
            where('createdAt', '<=', end)
        );

        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setData(entries);
        setLoading(false);
    };

    const getDateRange = () => {
        const now = new Date();
        switch (timeRange) {
            case 'day':
                return { start: startOfDay(now), end: endOfDay(now) };
            case 'week':
                return { start: startOfWeek(now), end: endOfWeek(now) };
            case 'month':
                return { start: startOfMonth(now), end: endOfMonth(now) };
            case 'year':
                return { start: startOfYear(now), end: endOfYear(now) };
            default:
                return { start: startOfWeek(now), end: endOfWeek(now) };
        }
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    if (loading) {
        return <div className="text-center mt-8">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

            <div className="flex justify-center space-x-4 mb-8">
                <button
                    onClick={() => handleTimeRangeChange('day')}
                    className={`px-4 py-2 rounded ${timeRange === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Day
                </button>
                <button
                    onClick={() => handleTimeRangeChange('week')}
                    className={`px-4 py-2 rounded ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Week
                </button>
                <button
                    onClick={() => handleTimeRangeChange('month')}
                    className={`px-4 py-2 rounded ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Month
                </button>
                <button
                    onClick={() => handleTimeRangeChange('year')}
                    className={`px-4 py-2 rounded ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Year
                </button>
            </div>

            <DailySummary data={data} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SleepGraph data={data} timeRange={timeRange} />
                <FeedingGraph data={data} timeRange={timeRange} />
                <DiaperGraph data={data} timeRange={timeRange} />
                <ActivityGraph data={data} timeRange={timeRange} />
            </div>
        </div>
    );
};

export default DashboardPage;