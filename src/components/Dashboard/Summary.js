import React from 'react';
import { format, parseISO } from 'date-fns';
import { Moon, Utensils, DropletIcon, Activity, Ruler } from 'lucide-react';

const Summary = ({ data, timeRange }) => {
    const summary = data.reduce((acc, entry) => {
        switch (entry.type) {
            case 'sleep':
                acc.sleep += (new Date(entry.endTime) - new Date(entry.startTime)) / (1000 * 60 * 60);
                break;
            case 'feeding':
                acc.feedings++;
                break;
            case 'diaper':
                acc.diapers++;
                break;
            case 'activity':
                acc.activities++;
                break;
            case 'growth':
                if (!acc.latestGrowth || new Date(entry.measurementDate) > new Date(acc.latestGrowth.measurementDate)) {
                    acc.latestGrowth = entry;
                }
                break;
            default:
                break;
        }
        return acc;
    }, { sleep: 0, feedings: 0, diapers: 0, activities: 0, latestGrowth: null });

    const getTimeRangeText = () => {
        switch (timeRange) {
            case 'day':
                return 'Today';
            case 'week':
                return 'This Week';
            case 'month':
                return 'This Month';
            case 'year':
                return 'This Year';
            default:
                return 'Selected Period';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{getTimeRangeText()} Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-indigo-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold flex items-center"><Moon className="w-5 h-5 mr-2" />Sleep</h3>
                    <p className="text-2xl font-bold">{summary.sleep.toFixed(2)} hours</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold flex items-center"><Utensils className="w-5 h-5 mr-2" />Feedings</h3>
                    <p className="text-2xl font-bold">{summary.feedings}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold flex items-center"><DropletIcon className="w-5 h-5 mr-2" />Diapers</h3>
                    <p className="text-2xl font-bold">{summary.diapers}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold flex items-center"><Activity className="w-5 h-5 mr-2" />Activities</h3>
                    <p className="text-2xl font-bold">{summary.activities}</p>
                </div>
                {summary.latestGrowth && (
                    <>
                        <div className="bg-pink-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center"><Ruler className="w-5 h-5 mr-2" />Latest Growth</h3>
                            <p className="text-sm">{format(parseISO(summary.latestGrowth.measurementDate), 'MMM d, yyyy')}</p>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold">Weight: {summary.latestGrowth.weight} kg</p>
                            <p className="text-sm font-semibold">Height: {summary.latestGrowth.height} cm</p>
                            <p className="text-sm font-semibold">Head: {summary.latestGrowth.headCircumference} cm</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Summary;