import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardContent } from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchUsers = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'users'));
            const querySnapshot = await getDocs(q);
            const fetchedUsers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(fetchedUsers);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            setError('Failed to update user role');
            console.error('Error updating user role:', err);
        }
    };

    if (loading) {
        return <div>Loading admin data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <Card className="mb-6">
                <CardHeader>User Management</CardHeader>
                <CardContent>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Email</th>
                                <th className="text-left">Role</th>
                                <th className="text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="mr-2 p-1 border rounded"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>System Settings</CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="maxUsersPerFamily" className="block mb-1">Max Users Per Family</label>
                            <Input type="number" id="maxUsersPerFamily" defaultValue={5} />
                        </div>
                        <div>
                            <label htmlFor="maxChildrenPerFamily" className="block mb-1">Max Children Per Family</label>
                            <Input type="number" id="maxChildrenPerFamily" defaultValue={3} />
                        </div>
                        <Button type="submit">Save Settings</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>Usage Statistics</CardHeader>
                <CardContent>
                    <p>Total Users: {users.length}</p>
                    <p>Admin Users: {users.filter(u => u.role === 'admin').length}</p>
                    {/* Add more statistics here */}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminPage;