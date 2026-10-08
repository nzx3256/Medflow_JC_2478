// import { useState } from 'react';
import { Button, Typography } from '@mui/material';

import { PageProvider, usePage } from './context/PageContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import AppHeader from './components/layout/AppHeader.jsx';
import GraphTabs from './components/layout/GraphTabs.jsx';
import EquipmentDataGrid from './components/graphs/EquipmentDataGrid.jsx';
import HospitalDataGrid from './components/graphs/HospitalDataGrid.jsx';
import TechnicianDataGrid from './components/graphs/TechnicianDataGrid.jsx';
import WorkOrderDataGrid from './components/graphs/WorkOrderDataGrid.jsx';
import ServiceReportDataGrid from './components/graphs/ServiceReportDataGrid.jsx';
import MetricsPage from './components/pages/MetricsPage.jsx';
import BackToTopButton from './components/layout/BackToTopButton.jsx';
import DataGridDisplay from './components/layout/DataGridDisplay.jsx';

const tabsMap = {
    "Dashboard": <DataGridDisplay />,
    "Service Reports": <ServiceReportDataGrid />,
    "Metrics": <MetricsPage />
};
const frontPage = (<GraphTabs tabDict={tabsMap} />);

function Dashboard() {
    const { screen } = usePage();
    return (
        <>
            <AppHeader />
            {screen}
            <BackToTopButton />
        </>
    );
}

function LoginHandle() {
    const { isAuthenticated } = useAuth();
    return (
        <>
            {isAuthenticated ? <Dashboard /> : <LoginPage />}
        </>
    );
}

function Start() {
    return <Screen />;
}

function App() {
    return (
        <AuthProvider>
            <PageProvider frontPage={frontPage}>
                <LoginHandle />
            </PageProvider>
        </AuthProvider>
    );
}

export default App;
