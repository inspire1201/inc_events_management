import React, { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL


const AllUsersSummary = () => {
    const [usersSummary, setUsersSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/all-users-summary`);
                setUsersSummary(response.data);
            } catch (err) {
                setError('Failed to fetch users summary.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) return <div>Loading users summary...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>All Logged-In Users Summary</h2>
            {usersSummary.length > 0 ? (
                <ul>
                    {usersSummary.map((user) => (
                        <li key={user.user_id}>
                            <strong>User ID: {user.user_id}</strong>
                            <p>Last visit: {new Date(user.last_visit).toLocaleString()}</p>
                            <p>Visits this month: {user.visits_this_month}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default AllUsersSummary;