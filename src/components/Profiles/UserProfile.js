import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Button from '../UI/Button';
import Input from '../UI/Input';

const UserProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (user) {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            }
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleUpdate = async () => {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, profile);
        setIsEditing(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">User Profile</h1>
            {!isEditing ? (
                <div>
                    <p>Name: {profile.displayName}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone: {profile.phone}</p>
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
            ) : (
                <div>
                    <Input
                        type="text"
                        value={profile.displayName || ''}
                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                        placeholder="Name"
                    />
                    <Input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="Phone"
                    />
                    <Button onClick={handleUpdate}>Save Changes</Button>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;