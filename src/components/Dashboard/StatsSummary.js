import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { startOfDay, endOfDay } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

const StatsSummary = () => {
    const [stats, setStats] = useState({
        totalSleep: 0,
        totalFeedings: 0,
        totalDiapers: 0,
        totalActivities: 0
    });

    useEffect(() => {
        const fetchDailyStats = async () => {
            const start = startOfDay(new Date());
            const end = endOfDay(new Date());

            const q = query(
                collection(db, 'journalEntries'),
                where('startTime', '>=', start),
                where('startTime', '<=', end)
            );

            const querySnapshot = await getDocs(q);
            const entries = querySnapshot.docs.map(doc => doc.data());

            const newStats = entries.reduce((acc, entry) => {
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
            }, {
                totalSleep: 0,
                totalFeedings: 0,
                totalDiapers: 0,
                totalActivities: 0
            });

            setStats({
                ...newStats,
                totalSleep: parseFloat(newStats.totalSleep.toFixed(2))
            });
        };

        fetchDailyStats();
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardContent>
                    <h3 className="text-lg font-semibold">Total Sleep</h3>
                    <p className="text-3xl font-bold">{stats.totalSleep} hours</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <h3 className="text-lg font-semibold">Feedings</h3>
                    <p className="text-3xl font-bold">{stats.totalFeedings}</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <h3 className="text-lg font-semibold">Diaper Changes</h3>
                    <p className="text-3xl font-bold">{stats.totalDiapers}</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <h3 className="text-lg font-semibold">Activities</h3>
                    <p className="text-3xl font-bold">{stats.totalActivities}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsSummary;