import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'technician_id', headerName: 'Technician ID', width: 150, type: 'number' },
    { field: "technician_name", headerName: 'Technician Name', width: 200, type: 'string' },
    { field: 'active_orders', headerName: 'Active Orders', width: 200, type: 'number' },
    { field: 'supervisor_id', headerName: 'Supervisor ID', width: 200, type: 'number' },
];

function ReportingLinesDataGrid() {
    return (
        <GeneralDataGrid
            columns={columns}
            title="Reporting Lines"
            id="technician_id"
            endpoint="/hospitals/reporting_lines"
            controls={{
                size: 3,
                type: 'filter',
                label: 'Supervisor ID',
                paramName: 'supervisor_id',
                defaultValue: 0,
            }}
        />
    );
}
export default ReportingLinesDataGrid;
