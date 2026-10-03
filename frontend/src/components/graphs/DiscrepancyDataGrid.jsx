import { useEffect, userState, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Alert, Box, CircularProgress, FormControl, Grid,
    InputLabel, MenuItem, Select, Typography,
} from '@mui/material';
import apiClient from '../../api/client.js';
import DataGridToolbar from '../layout/DataGridToolbar.jsx';
import GeneralDataGrid from './GeneralDataGrid.jsx';


const columns = [
    { field: 'work_order_id', headerName: 'Work Order ID', width: 120, type: 'number' },
    { field: 'work_order_title', headerName: 'Order Title', width: 220 },
    { field: 'equipment_id', headerName: 'Equipment ID', width: 140, type: 'number' },
    { field: 'technician_id', headerName: 'Technician ID', width: 150, type: 'number' },
];

const PRIORITY_OPTIONS = ['Low', 'Medium', 'Critical'];

function DiscrepancyDataGrid() {
    return (
        <GeneralDataGrid
            columns={columns}
            id='work_order_id'
            endpoint='/work_orders/discrepancies'
            title='Co-location Discrepancies'
            controls={{
                size: 1,
                type: 'select',
                options: PRIORITY_OPTIONS,
                label: 'Priority',
                paramName: 'priority'
            }}
        />
    );
}

export default DiscrepancyDataGrid;

