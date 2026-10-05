import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import apiClient from '../../api/client.js';
import GeneralDataGrid from './GeneralDataGrid.jsx';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'serial_number', headerName: 'Serial Number', width: 150 },
    { field: 'model', headerName: 'Model', width: 160 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'charge_level', headerName: 'Fuel Level', width: 120, type: 'number' },
    { field: 'hospital_id', headerName: 'Farm ID', width: 110, type: 'number' },
];

function LowChargeDataGrid() {
    return (
        <GeneralDataGrid
            columns={columns}
            title={'Low Charge Equipment:'}
            endpoint={'/equipment'}
            controls={{
                type: 'filter',
                size: 3,
                label: 'Charge Threshold',
                paramName: "threshold",
                defaultValue: 50,
                min_value: 0,
                max_value: 100
            }}
        />
    );
}

export default LowChargeDataGrid;

