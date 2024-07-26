import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/UI/Card';

const JournalEntry = ({ entry }) => {
    const [childName, setChildName] = useState('');

    useEffect(() => {
        const fetchChildName = async () => {
            const childDoc = await getDoc(doc(db, 'children', entry.childId));
            if (childDoc.exists()) {
                setChildName(childDoc.data().name);
            }
        };
        fetchChildName();
    }, [entry.childId]);

    const getEntryTypeColor = (type) => {
        const colors = {
            sleep: 'bg-blue-100 text-blue-800',
            feeding: 'bg-green-100 text-green-800',
            diaper: 'bg-yellow-100 text-yellow-800',
            activity: 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const formatFeedingType = (type) => {
        return type === 'breast_milk' ? 'Breast Milk' : 'Formula';
    };

    return (
        <Card className="mb-4">
            <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold capitalize">{entry.type}</h3>
                <span className={`px-2 py-1 rounded ${getEntryTypeColor(entry.type)}`}>{entry.type}</span>
            </CardHeader>
            <CardContent>
                <p className="font-bold mb-2">Child: {childName}</p>
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
                        <p>Type: {formatFeedingType(entry.feedingType)}</p>
                        {entry.quantity && entry.unit && (
                            <p>Amount: {entry.quantity} {entry.unit}</p>
                        )}
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