import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const HomePage = () => {
    const { user, selectedFamily, setSelectedFamily } = useAuth();
    const [families, setFamilies] = useState([]);
    const [newFamilyName, setNewFamilyName] = useState('');

    const fetchFamilies = useCallback(async () => {
        if (user) {
            const q = query(collection(db, 'families'), where('members', 'array-contains', user.uid));
            const querySnapshot = await getDocs(q);
            const fetchedFamilies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFamilies(fetchedFamilies);

            if (fetchedFamilies.length > 0 && !selectedFamily) {
                setSelectedFamily(fetchedFamilies[0]);
            }
        }
    }, [user, selectedFamily, setSelectedFamily]);

    useEffect(() => {
        fetchFamilies();
    }, [fetchFamilies]);

    const createFamily = async () => {
        if (newFamilyName.trim()) {
            const docRef = await addDoc(collection(db, 'families'), {
                name: newFamilyName,
                members: [user.uid],
                createdBy: user.uid,
                createdAt: new Date()
            });
            setNewFamilyName('');
            await fetchFamilies();
            setSelectedFamily({ id: docRef.id, name: newFamilyName });
        }
    };

    const handleFamilyChange = (e) => {
        const family = families.find(f => f.id === e.target.value);
        if (family && (!selectedFamily || family.id !== selectedFamily.id)) {
            setSelectedFamily(family);
        }
    };

    if (!user) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Baby Journal</h1>
                <p className="mb-4">Please log in or sign up to get started.</p>
                <Link to="/login" className="mr-4">
                    <Button>Login</Button>
                </Link>
                <Link to="/signup">
                    <Button>Sign Up</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.displayName || user.email}</h1>

            {families.length === 0 ? (
                <div>
                    <p className="mb-4">You haven't created any families yet. Create your first family to get started!</p>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={newFamilyName}
                            onChange={(e) => setNewFamilyName(e.target.value)}
                            placeholder="Family Name"
                            className="border p-2 mr-2"
                        />
                        <Button onClick={createFamily}>Create Family</Button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Select a Family</h2>
                    <select
                        value={selectedFamily ? selectedFamily.id : ''}
                        onChange={handleFamilyChange}
                        className="w-full p-2 border rounded mb-4"
                    >
                        <option value="">Select a family</option>
                        {families.map(family => (
                            <option key={family.id} value={family.id}>{family.name}</option>
                        ))}
                    </select>

                    <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">Create New Family</h3>
                        <input
                            type="text"
                            value={newFamilyName}
                            onChange={(e) => setNewFamilyName(e.target.value)}
                            placeholder="Family Name"
                            className="border p-2 mr-2"
                        />
                        <Button onClick={createFamily}>Create Family</Button>
                    </div>
                </div>
            )}

            {selectedFamily && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Selected Family: {selectedFamily.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to={`/children/${selectedFamily.id}`}>
                            <Card className="p-4">
                                <h3 className="text-xl font-semibold">Children</h3>
                                <p>Manage children profiles</p>
                            </Card>
                        </Link>
                        <Link to={`/journal/${selectedFamily.id}`}>
                            <Card className="p-4">
                                <h3 className="text-xl font-semibold">Journal</h3>
                                <p>Record and view daily entries</p>
                            </Card>
                        </Link>
                        <Link to={`/dashboard/${selectedFamily.id}`}>
                            <Card className="p-4">
                                <h3 className="text-xl font-semibold">Dashboard</h3>
                                <p>View statistics and reports</p>
                            </Card>
                        </Link>
                        <Link to={`/family-settings/${selectedFamily.id}`}>
                            <Card className="p-4">
                                <h3 className="text-xl font-semibold">Family Settings</h3>
                                <p>Manage family members and settings</p>
                            </Card>
                        </Link>
                    </div>
                </div>
            )}

            <Link to="/profile" className="block mt-8">
                <Button>View Profile</Button>
            </Link>
        </div>
    );
};

export default HomePage;