import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Card, { CardHeader, CardContent, CardFooter } from '../../components/UI/Card';
import { Baby, Moon, Utensils, Activity, Clock, User, DropletIcon, Camera, Ruler } from 'lucide-react';

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
            sleep: 'bg-indigo-100 text-indigo-800',
            feeding: 'bg-green-100 text-green-800',
            diaper: 'bg-yellow-100 text-yellow-800',
            activity: 'bg-purple-100 text-purple-800',
            growth: 'bg-pink-100 text-pink-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const formatFeedingType = (type) => {
        return type === 'breast_milk' ? 'Breast Milk' : 'Formula';
    };

    const entryTypeIcons = {
        sleep: <Moon className="w-5 h-5 text-indigo-500" />,
        feeding: <Utensils className="w-5 h-5 text-green-500" />,
        diaper: <DropletIcon className="w-5 h-5 text-yellow-500" />,
        activity: <Activity className="w-5 h-5 text-purple-500" />,
        growth: <Ruler className="w-5 h-5 text-pink-500" />
    };

    return (
        <Card className="mb-4 bg-white shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
            <CardHeader className={`flex justify-between items-center p-4 ${getEntryTypeColor(entry.type)}`}>
                <div className="flex items-center">
                    {entryTypeIcons[entry.type]}
                    <h3 className="text-lg font-semibold capitalize ml-2">{entry.type}</h3>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <p className="font-bold mb-2 flex items-center">
                    <Baby className="w-5 h-5 mr-2 text-blue-500" />
                    {childName}
                </p>
                {entry.type === 'sleep' && (
                    <div className="space-y-1">
                        <p className="flex items-center"><Clock className="w-4 h-4 mr-2" />Start: {format(new Date(entry.startTime), 'PPpp')}</p>
                        <p className="flex items-center"><Clock className="w-4 h-4 mr-2" />End: {format(new Date(entry.endTime), 'PPpp')}</p>
                        <p className="flex items-center"><Moon className="w-4 h-4 mr-2" />Duration: {((new Date(entry.endTime) - new Date(entry.startTime)) / (1000 * 60 * 60)).toFixed(2)} hours</p>
                    </div>
                )}
                {entry.type === 'feeding' && (
                    <div className="space-y-1">
                        <p className="flex items-center"><Clock className="w-4 h-4 mr-2" />Time: {format(new Date(entry.time), 'PPpp')}</p>
                        <p className="flex items-center"><Utensils className="w-4 h-4 mr-2" />Type: {formatFeedingType(entry.feedingType)}</p>
                        {entry.quantity && entry.unit && (
                            <p className="flex items-center"><Utensils className="w-4 h-4 mr-2" />Amount: {entry.quantity} {entry.unit}</p>
                        )}
                    </div>
                )}
                {entry.type === 'diaper' && (
                    <div className="space-y-1">
                        <p className="flex items-center"><Clock className="w-4 h-4 mr-2" />Time: {format(new Date(entry.time), 'PPpp')}</p>
                        <p className="flex items-center"><DropletIcon className="w-4 h-4 mr-2" />Type: {entry.diaperType}</p>
                    </div>
                )}
                {entry.type === 'activity' && (
                    <div className="space-y-1">
                        <p className="flex items-center"><Clock className="w-4 h-4 mr-2" />Time: {format(new Date(entry.time), 'PPpp')}</p>
                        <p className="flex items-center"><Activity className="w-4 h-4 mr-2" />Activity: {entry.activityType}</p>
                        <p className="flex items-center"><Clock className="w-4 h-4 mr-2" />Duration: {entry.duration} minutes</p>
                        {entry.notes && <p className="flex items-center"><Activity className="w-4 h-4 mr-2" />Notes: {entry.notes}</p>}
                        {entry.photoUrl && (
                            <div className="mt-2">
                                <p className="flex items-center mb-1"><Camera className="w-4 h-4 mr-2" />Photo:</p>
                                <img src={entry.photoUrl} alt="Activity" className="w-full rounded-lg" />
                            </div>
                        )}
                    </div>
                )}
                {entry.type === 'growth' && (
                    <div className="space-y-1">
                        <p className="flex items-center"><Clock className="w-4 h-4 mr-2" />Date: {format(new Date(entry.measurementDate), 'PPpp')}</p>
                        {entry.weight && <p className="flex items-center"><Ruler className="w-4 h-4 mr-2" />Weight: {entry.weight} kg</p>}
                        {entry.height && <p className="flex items-center"><Ruler className="w-4 h-4 mr-2" />Height: {entry.height} cm</p>}
                        {entry.headCircumference && <p className="flex items-center"><Ruler className="w-4 h-4 mr-2" />Head Circumference: {entry.headCircumference} cm</p>}
                    </div>
                )}
            </CardContent>
            <CardFooter className="text-sm text-gray-500 bg-gray-50 p-4">
                <p className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    Created by: {entry.createdBy}
                </p>
            </CardFooter>
        </Card>
    );
};

export default JournalEntry;