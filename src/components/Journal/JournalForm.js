import React, { useState, useEffect } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { Baby, Moon, Utensils, Activity, Clock, Droplet, Milk, DropletIcon, Camera, Ruler } from 'lucide-react';

const activityTypes = [
    'Tummy Time', 'Bath', 'Reading', 'Playtime', 'Walk', 'Doctor Visit',
    'Milestone', 'Medication', 'Vaccination', 'Other'
];

const JournalForm = ({ onEntryAdded }) => {
    const [entryType, setEntryType] = useState('sleep');
    const [formData, setFormData] = useState({});
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [photo, setPhoto] = useState(null);
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
            let photoUrl = '';
            if (photo) {
                const photoRef = ref(storage, `activities/${auth.currentUser.uid}/${Date.now()}_${photo.name}`);
                await uploadBytes(photoRef, photo);
                photoUrl = await getDownloadURL(photoRef);
            }

            await addDoc(collection(db, 'journalEntries'), {
                ...formData,
                type: entryType,
                childId: selectedChild,
                createdBy: user.uid,
                createdAt: new Date(),
                photoUrl
            });
            onEntryAdded();
            setFormData({});
            setEntryType('sleep');
            setPhoto(null);
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const entryTypeIcons = {
        sleep: <Moon className="w-5 h-5 mr-2 text-indigo-400" />,
        feeding: <Utensils className="w-5 h-5 mr-2 text-green-400" />,
        diaper: <DropletIcon className="w-5 h-5 mr-2 text-yellow-400" />,
        activity: <Activity className="w-5 h-5 mr-2 text-purple-400" />
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center bg-gray-50 p-2 rounded">
                <Baby className="w-5 h-5 mr-2 text-blue-400" />
                <select
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="w-full p-2 bg-transparent border-none focus:ring-0"
                    required
                >
                    <option value="">Select a child</option>
                    {children.map(child => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center bg-gray-50 p-2 rounded">
                {entryTypeIcons[entryType]}
                <select
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value)}
                    className="w-full p-2 bg-transparent border-none focus:ring-0"
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

            {entryType === 'diaper' && (
                <>
                    <Input
                        type="datetime-local"
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                    />
                    <select
                        onChange={(e) => setFormData({ ...formData, diaperType: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select diaper type</option>
                        <option value="wet">Wet</option>
                        <option value="dirty">Dirty</option>
                        <option value="both">Both</option>
                    </select>
                </>
            )}

            {entryType === 'activity' && (
                <div className="space-y-2">
                    <div className="flex items-center bg-gray-50 p-2 rounded">
                        <Activity className="w-5 h-5 mr-2 text-purple-400" />
                        <select
                            onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                            className="w-full p-2 bg-transparent border-none focus:ring-0"
                            required
                        >
                            <option value="">Select activity type</option>
                            {activityTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        type="datetime-local"
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                        className="w-full"
                    />
                    <Input
                        type="number"
                        placeholder="Duration (minutes)"
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        required
                        className="w-full"
                    />
                    <textarea
                        placeholder="Notes"
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-gray-400" />
                        <input
                            type="file"
                            onChange={handlePhotoChange}
                            accept="image/*"
                            className="w-full"
                        />
                    </div>
                </div>
            )}

            {entryType === 'growth' && (
                <div className="space-y-2">
                    <div className="flex items-center bg-gray-50 p-2 rounded">
                        <Ruler className="w-5 h-5 mr-2 text-green-400" />
                        <Input
                            type="number"
                            step="0.1"
                            placeholder="Weight (kg)"
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center bg-gray-50 p-2 rounded">
                        <Ruler className="w-5 h-5 mr-2 text-blue-400" />
                        <Input
                            type="number"
                            step="0.1"
                            placeholder="Height (cm)"
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center bg-gray-50 p-2 rounded">
                        <Ruler className="w-5 h-5 mr-2 text-red-400" />
                        <Input
                            type="number"
                            step="0.1"
                            placeholder="Head Circumference (cm)"
                            onChange={(e) => setFormData({ ...formData, headCircumference: e.target.value })}
                            className="w-full"
                        />
                    </div>
                    <Input
                        type="datetime-local"
                        onChange={(e) => setFormData({ ...formData, measurementDate: e.target.value })}
                        required
                        className="w-full"
                    />
                </div>
            )}

            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white transition duration-300 ease-in-out transform hover:scale-105">
                Add Entry
            </Button>
        </form>
    );
};

export default JournalForm;