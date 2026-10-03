import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'title', headerName: 'Title', width: 320 },
    { field: 'priority', headerName: 'Priority', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'equipment_id', headerName: 'Equipment ID', width: 120, type: 'number' },
    { field: 'technician_id', headerName: 'Technician ID', width: 120, type: 'number' },
];

function WorkOrderDataGrid() {
    return (
        <GeneralDataGrid
            columns={columns}
            title="Work Orders"
            endpoint="/work_orders"
        />
    );
}
export default WorkOrderDataGrid;
