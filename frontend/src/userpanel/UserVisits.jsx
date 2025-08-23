import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const apiUrl = import.meta.env.VITE_API_URL

const UserVisits = () => {
    const { user } = useAuth();
    const [lastVisit, setLastVisit] = useState('');
    const [visitsThisMonth, setVisitsThisMonth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            try {
                const lastVisitRes = await axios.get(`${apiUrl}/api/last-visit/${user.userId}`);
                setLastVisit(lastVisitRes.data.lastVisit);

                // Fetch monthly visits
                const monthlyVisitsRes = await axios.get(`${apiUrl}/api/visits-this-month/${user.userId}`);
                setVisitsThisMonth(monthlyVisitsRes.data.visitsThisMonth);

            } catch (err) {
                setError('Failed to fetch user data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Your Visit Summary</h2>
            <p>Your last visit: {lastVisit ? new Date(lastVisit).toLocaleString() : 'N/A'}</p>
            <p>Visits this month: {visitsThisMonth}</p>
        </div>
    );
};

export default UserVisits;