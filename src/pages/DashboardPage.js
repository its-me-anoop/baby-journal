import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import SleepGraph from '../components/Dashboard/SleepGraph';
import FeedingGraph from '../components/Dashboard/FeedingGraph';
import DiaperGraph from '../components/Dashboard/DiaperGraph';
import ActivityGraph from '../components/Dashboard/ActivityGraph';
import GrowthGraph from '../components/Dashboard/GrowthGraph';
import Summary from '../components/Dashboard/Summary';

const DashboardPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week');
    const { selectedFamily } = useAuth();

    const getDateRange = useCallback(() => {
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
    }, [timeRange]);

    const fetchData = useCallback(async () => {
        if (!selectedFamily) return;

        setLoading(true);
        const { start, end } = getDateRange();
        const q = query(
            collection(db, 'journalEntries'),
            where('familyId', '==', selectedFamily.id),
            where('createdAt', '>=', start),
            where('createdAt', '<=', end)
        );

        try {
            const querySnapshot = await getDocs(q);
            const entries = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(entries);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedFamily, getDateRange]);

    useEffect(() => {
        if (selectedFamily) {
            fetchData();
        }
    }, [selectedFamily, fetchData]);

    if (!selectedFamily) {
        return <div className="text-center mt-8">Please select a family first.</div>;
    }

    if (loading) {
        return <div className="text-center mt-8">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center mb-8">Dashboard for {selectedFamily.name}</h1>

            <div className="flex justify-center space-x-4 mb-8">
                {['day', 'week', 'month', 'year'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                ))}
            </div>

            <Summary data={data} timeRange={timeRange} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SleepGraph data={data} timeRange={timeRange} />
                <FeedingGraph data={data} timeRange={timeRange} />
                <DiaperGraph data={data} timeRange={timeRange} />
                <ActivityGraph data={data} timeRange={timeRange} />
                <GrowthGraph data={data} timeRange={timeRange} />
            </div>
        </div>
    );
};

export default DashboardPage;