// src/components/JournalEntryCard.js
import React from 'react';
import './JournalEntryCard.css';

const JournalEntryCard = ({ entry }) => {
    return (
        <div className="journal-entry-card p-4 mb-4 border rounded shadow">
            <h3 className="text-xl font-bold mb-2">{entry.title}</h3>
            <p className="mb-2">{entry.description}</p>
            <small className="text-gray-600">{entry.date}</small>
        </div>
    );
};

export default JournalEntryCard;
