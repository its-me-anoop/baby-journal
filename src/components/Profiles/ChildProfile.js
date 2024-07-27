import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY; // Store this securely, not in the code

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const ChildProfile = () => {
    const { childId } = useParams();
    const [child, setChild] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        if (childId) {
            fetchChildProfile();
        }
    }, [childId]);

    const fetchChildProfile = async () => {
        const docRef = doc(db, 'children', childId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setChild({
                ...data,
                healthInfo: data.healthInfo ? decrypt(data.healthInfo) : '',
                medications: data.medications ? decrypt(data.medications) : '',
            });
        }
    };

    const handleUpdate = async () => {
        const docRef = doc(db, 'children', childId);
        const encryptedData = {
            ...child,
            healthInfo: encrypt(child.healthInfo),
            medications: encrypt(child.medications),
        };
        await updateDoc(docRef, encryptedData);

        if (photo) {
            const storageRef = ref(storage, `children/${childId}/photo`);
            await uploadBytes(storageRef, photo);
            const photoURL = await getDownloadURL(storageRef);
            await updateDoc(docRef, { photoURL });
        }

        setIsEditing(false);
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Child Profile</h1>
            {!isEditing ? (
                <div>
                    {child.photoURL && <img src={child.photoURL} alt={child.name} className="w-32 h-32 object-cover rounded-full mb-4" />}
                    <p>Name: {child.name}</p>
                    <p>Birthdate: {child.birthdate}</p>
                    <p>Health Information: {child.healthInfo}</p>
                    <p>Medications: {child.medications}</p>
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
            ) : (
                <div>
                    <Input
                        type="text"
                        value={child.name || ''}
                        onChange={(e) => setChild({ ...child, name: e.target.value })}
                        placeholder="Name"
                    />
                    <Input
                        type="date"
                        value={child.birthdate || ''}
                        onChange={(e) => setChild({ ...child, birthdate: e.target.value })}
                    />
                    <textarea
                        value={child.healthInfo || ''}
                        onChange={(e) => setChild({ ...child, healthInfo: e.target.value })}
                        placeholder="Health Information"
                        className="w-full p-2 border rounded mb-2"
                    />
                    <textarea
                        value={child.medications || ''}
                        onChange={(e) => setChild({ ...child, medications: e.target.value })}
                        placeholder="Medications"
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input type="file" onChange={handlePhotoChange} accept="image/*" />
                    <Button onClick={handleUpdate}>Save Changes</Button>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
            )}
        </div>
    );
};

export default ChildProfile;