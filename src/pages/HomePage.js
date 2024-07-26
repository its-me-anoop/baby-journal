import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardContent } from '@/components/UI/Card';
import Button from '@/components/UI/Button';

const HomePage = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Welcome to Baby Journal</h1>

            {user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>Quick Actions</CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Link to="/journal/new">
                                    <Button variant="primary" className="w-full">Add Journal Entry</Button>
                                </Link>
                                <Link to="/dashboard">
                                    <Button variant="secondary" className="w-full">View Dashboard</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>Recent Activity</CardHeader>
                        <CardContent>
                            {/* You can add a list of recent journal entries here */}
                            <p>No recent activities to show.</p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="text-center">
                    <p className="mb-6 text-xl">Track your baby's growth, milestones, and daily activities with ease.</p>
                    <div className="space-x-4">
                        <Link to="/login">
                            <Button variant="primary">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="secondary">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>Journal Entries</CardHeader>
                        <CardContent>
                            Keep track of feedings, diaper changes, sleep patterns, and more.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>Growth Tracking</CardHeader>
                        <CardContent>
                            Monitor your baby's weight, height, and other important metrics.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>Milestone Recording</CardHeader>
                        <CardContent>
                            Never miss a moment. Record and celebrate your baby's achievements.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HomePage;