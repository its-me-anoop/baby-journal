import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const FamilySettingsPage = () => {
    const { familyId } = useParams();
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [updatedName, setUpdatedName] = useState('');

    useEffect(() => {
        const fetchFamily = async () => {
            const docRef = doc(db, 'families', familyId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const familyData = { id: docSnap.id, ...docSnap.data() };
                setFamily(familyData);
                setUpdatedName(familyData.name);
            }
            setLoading(false);
        };

        fetchFamily();
    }, [familyId]);

    const handleUpdate = async () => {
        if (!updatedName.trim()) {
            alert('Family name cannot be empty');
            return;
        }

        try {
            const docRef = doc(db, 'families', familyId);
            await updateDoc(docRef, { name: updatedName });
            setFamily({ ...family, name: updatedName });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating family:', error);
            alert('Failed to update family. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!family) {
        return <div>Family not found</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Family Settings</h1>
            {editMode ? (
                <div className="mb-4">
                    <Input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        placeholder="Family Name"
                        className="mb-2"
                    />
                    <Button onClick={handleUpdate} className="mr-2">Save</Button>
                    <Button onClick={() => setEditMode(false)} variant="secondary">Cancel</Button>
                </div>
            ) : (
                <div className="mb-4">
                    <p className="mb-2">Family Name: {family.name}</p>
                    <Button onClick={() => setEditMode(true)}>Edit Family Name</Button>
                </div>
            )}
            {/* Add more family settings here */}
        </div>
    );
};

export default FamilySettingsPage;