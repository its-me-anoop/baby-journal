import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format } from 'date-fns';
import Card, { CardHeader, CardContent } from '../components/UI/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
    const [dailyStats, setDailyStats] = useState({
        totalSleep: 0,
        totalFeedings: 0,
        totalDiapers: 0,
        totalActivities: 0
    });
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchDailyStats = useCallback(async () => {
        if (!user) return;
        const start = startOfDay(new Date());
        const end = endOfDay(new Date());
        const q = query(
            collection(db, 'journalEntries'),
            where('createdBy', '==', user.uid),
            where('createdAt', '>=', start),
            where('createdAt', '<=', end)
        );
        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => doc.data());

        const stats = entries.reduce((acc, entry) => {
            switch (entry.type) {
                case 'sleep':
                    acc.totalSleep += (new Date(entry.endTime) - new Date(entry.startTime)) / (1000 * 60 * 60);
                    break;
                case 'feeding':
                    acc.totalFeedings += 1;
                    break;
                case 'diaper':
                    acc.totalDiapers += 1;
                    break;
                case 'activity':
                    acc.totalActivities += 1;
                    break;
                default:
                    break;
            }
            return acc;
        }, { totalSleep: 0, totalFeedings: 0, totalDiapers: 0, totalActivities: 0 });

        setDailyStats({
            ...stats,
            totalSleep: parseFloat(stats.totalSleep.toFixed(2))
        });
    }, [user]);

    const fetchWeeklyData = useCallback(async () => {
        if (!user) return;
        const start = startOfWeek(new Date());
        const end = endOfWeek(new Date());
        const q = query(
            collection(db, 'journalEntries'),
            where('createdBy', '==', user.uid),
            where('createdAt', '>=', start),
            where('createdAt', '<=', end)
        );
        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => doc.data());

        const weekData = Array.from({ length: 7 }, (_, i) => ({
            date: format(start.setDate(start.getDate() + i), 'EEE'),
            sleep: 0,
            feedings: 0,
            diapers: 0,
            activities: 0
        }));

        entries.forEach(entry => {
            const dayIndex = new Date(entry.createdAt.toDate()).getDay();
            switch (entry.type) {
                case 'sleep':
                    weekData[dayIndex].sleep += (new Date(entry.endTime) - new Date(entry.startTime)) / (1000 * 60 * 60);
                    break;
                case 'feeding':
                    weekData[dayIndex].feedings += 1;
                    break;
                case 'diaper':
                    weekData[dayIndex].diapers += 1;
                    break;
                case 'activity':
                    weekData[dayIndex].activities += 1;
                    break;
                default:
                    break;
            }
        });

        setWeeklyData(weekData);
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchDailyStats(), fetchWeeklyData()]);
            setLoading(false);
        };
        fetchData();
    }, [fetchDailyStats, fetchWeeklyData]);

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardHeader>Total Sleep Today</CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{dailyStats.totalSleep} hours</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>Feedings Today</CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{dailyStats.totalFeedings}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>Diaper Changes Today</CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{dailyStats.totalDiapers}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>Activities Today</CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{dailyStats.totalActivities}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>Weekly Overview</CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sleep" fill="#8884d8" name="Sleep (hours)" />
                                <Bar dataKey="feedings" fill="#82ca9d" name="Feedings" />
                                <Bar dataKey="diapers" fill="#ffc658" name="Diapers" />
                                <Bar dataKey="activities" fill="#ff8042" name="Activities" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;