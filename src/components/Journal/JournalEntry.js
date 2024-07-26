import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const JournalEntry = ({ entry }) => {
    const getEntryTypeColor = (type) => {
        const colors = {
            sleep: 'bg-blue-100 text-blue-800',
            feeding: 'bg-green-100 text-green-800',
            diaper: 'bg-yellow-100 text-yellow-800',
            activity: 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Card className="mb-4">
            <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold capitalize">{entry.type}</h3>
                <Badge className={getEntryTypeColor(entry.type)}>{entry.type}</Badge>
            </CardHeader>
            <CardContent>
                {entry.type === 'sleep' && (
                    <>
                        <p>Start: {format(new Date(entry.startTime), 'PPpp')}</p>
                        <p>End: {format(new Date(entry.endTime), 'PPpp')}</p>
                        <p>Duration: {((new Date(entry.endTime) - new Date(entry.startTime)) / (1000 * 60 * 60)).toFixed(2)} hours</p>
                    </>
                )}
                {entry.type === 'feeding' && (
                    <>
                        <p>Time: {format(new Date(entry.time), 'PPpp')}</p>
                        <p>Amount: {entry.amount}</p>
                    </>
                )}
                {entry.type === 'diaper' && (
                    <>
                        <p>Time: {format(new Date(entry.time), 'PPpp')}</p>
                        <p>Type: {entry.diaperType}</p>
                    </>
                )}
                {entry.type === 'activity' && (
                    <>
                        <p>Time: {format(new Date(entry.time), 'PPpp')}</p>
                        <p>Activity: {entry.activityType}</p>
                        <p>Duration: {entry.duration} minutes</p>
                    </>
                )}
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
                Created by: {entry.createdBy}
            </CardFooter>
        </Card>
    );
};

export default JournalEntry;