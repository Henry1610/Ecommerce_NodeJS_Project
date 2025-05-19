import Sidebar from "../components/Admin/Sidebar";
import Header from "../components/Admin/Header";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLayout({ children }) {
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {

            navigate('/login');
        } else {
            fetch('http://localhost:5000/api/admin/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(async (response) => {
                    console.log('Response Status:', response.status);
                    if (!response.ok) {
                        const errorData = await response.json();

                        throw new Error(errorData.message || 'Fetch failed');
                    }
                    return response.json()
                })
                .then(data => {
                    setDashboardData(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    navigate('/');
                });
        }
    }, [navigate]);
    if (!dashboardData) {
        return <div>Loading...</div>;
    }
    return (
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12 ms-sm-auto ">
                    <Header />
                </div>
                <div class="row">
                    <div class="col-md-3 ">
                        <Sidebar />
                    </div>
                    <div class="col-md-9">
                        {children}
                    </div>
                </div >
                


            </div>
        </div>
    )
}
export default AdminLayout;