import React, { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { Baby, Moon, Utensils, Diaper, Activity, Clock, Droplet, Milk } from 'lucide-react';

const JournalForm = ({ onEntryAdded }) => {
    const [entryType, setEntryType] = useState('sleep');
    const [formData, setFormData] = useState({});
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        const q = query(collection(db, 'children'), where('familyId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setChildren(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedChild) {
            alert('Please select a child');
            return;
        }
        try {
            await addDoc(collection(db, 'journalEntries'), {
                ...formData,
                type: entryType,
                childId: selectedChild,
                createdBy: user.uid,
                createdAt: new Date()
            });
            onEntryAdded();
            setFormData({});
            setEntryType('sleep');
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const entryTypeIcons = {
        sleep: <Moon className="w-5 h-5 mr-2" />,
        feeding: <Utensils className="w-5 h-5 mr-2" />,
        diaper: <Diaper className="w-5 h-5 mr-2" />,
        activity: <Activity className="w-5 h-5 mr-2" />
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50 p-6 rounded-lg shadow-md">
            <div className="flex items-center bg-white p-2 rounded">
                <Baby className="w-5 h-5 mr-2 text-blue-400" />
                <select
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="w-full p-2 border-none focus:ring-0"
                    required
                >
                    <option value="">Select a child</option>
                    {children.map(child => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center bg-white p-2 rounded">
                {entryTypeIcons[entryType]}
                <select
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value)}
                    className="w-full p-2 border-none focus:ring-0"
                >
                    <option value="sleep">Sleep</option>
                    <option value="feeding">Feeding</option>
                    <option value="diaper">Diaper</option>
                    <option value="activity">Activity</option>
                </select>
            </div>

            {entryType === 'sleep' && (
                <div className="space-y-2">
                    <div className="flex items-center bg-white p-2 rounded">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        <Input
                            type="datetime-local"
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            required
                            className="w-full border-none focus:ring-0"
                        />
                    </div>
                    <div className="flex items-center bg-white p-2 rounded">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        <Input
                            type="datetime-local"
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            required
                            className="w-full border-none focus:ring-0"
                        />
                    </div>
                </div>
            )}

            {entryType === 'feeding' && (
                <div className="space-y-2">
                    <div className="flex items-center bg-white p-2 rounded">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        <Input
                            type="datetime-local"
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                            className="w-full border-none focus:ring-0"
                        />
                    </div>
                    <div className="flex items-center bg-white p-2 rounded">
                        <Milk className="w-5 h-5 mr-2 text-blue-400" />
                        <select
                            onChange={(e) => setFormData({ ...formData, feedingType: e.target.value })}
                            className="w-full p-2 border-none focus:ring-0"
                            required
                        >
                            <option value="">Select feeding type</option>
                            <option value="breast_milk">Breast Milk</option>
                            <option value="formula">Formula</option>
                        </select>
                    </div>
                    <div className="flex items-center bg-white p-2 rounded">
                        <Droplet className="w-5 h-5 mr-2 text-blue-400" />
                        <Input
                            type="number"
                            placeholder="Quantity (optional)"
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full border-none focus:ring-0"
                        />
                        <select
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            className="ml-2 p-2 border-none focus:ring-0"
                        >
                            <option value="">Unit</option>
                            <option value="ml">ml</option>
                            <option value="oz">oz</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Similar updates for diaper and activity types */}

            <Button type="submit" className="w-full bg-green-400 hover:bg-green-500 text-white">Add Entry</Button>
        </form>
    );
};

export default JournalForm;