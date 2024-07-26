import React from 'react';
import FamilyManager from '../components/Family/FamilyManager';
import ChildManager from '../components/Family/ChildManager';

const FamilyPage = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Family Management</h1>
            <FamilyManager />
            <ChildManager />
        </div>
    );
};

export default FamilyPage;