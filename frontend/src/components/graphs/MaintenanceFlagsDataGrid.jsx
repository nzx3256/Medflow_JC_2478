import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Alert, Box, CircularProgress, Typography, TextField, Button } from '@mui/material';
import apiClient from '../../api/client.js';
import { Search } from '@mui/icons-material';
import GeneralDataGrid from './GeneralDataGrid.jsx'

const columns = [
    { field: 'hospital_id', headerName: 'Hospital ID', width: 120 },
    { field: 'hospital_name', headerName: 'Hospital Name', width: 180 },
    { field: 'percent_maintenance', headerName: 'Maintenance %', width: 230 },
];

function MaintenanceFlagsDataGrid() {
    return (
        <GeneralDataGrid
            title='Maintenance Flags'
            endpoint='/hospitals/maintenance_flags'
            id='hospital_id'
            columns={columns}
            controls={{
                size: 3,
                type: 'filter',
                label: '>= Maintenance %',
                paramName: 'threshold',
                defaultValue: 0,
                min_value: 0,
                max_value: 100
            }}
        />
    );
}

export default MaintenanceFlagsDataGrid;

