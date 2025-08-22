import Sidebar from "../components/Admin/Sidebar";
import Header from "../components/Admin/Header";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWithAuth } from '../../utils/tokenUtils';

const API_BASE = process.env.REACT_APP_SERVER_URL;

function AdminLayout({ children }) {
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const state = useSelector(state => state); // Lấy Redux state

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Sử dụng fetchWithAuth với getState function
                const res = await fetchWithAuth(`${API_BASE}/api/admin/dashboard`, {
                    method: 'GET'
                }, () => state, dispatch); // Truyền function trả về state
                
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Fetch failed');
                }
                
                const data = await res.json();
                setDashboardData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/');
            }
        };

        fetchDashboardData();
    }, [navigate, state, dispatch]);

    if (!dashboardData) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12 ms-sm-auto ">
                    <Header />
                </div>
                <div className="row">
                    <div className="col-md-3 ">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        {children}
                    </div>
                </div >
            </div>
        </div>
    )
}

export default AdminLayout;