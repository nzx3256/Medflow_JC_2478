import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'location_region', headerName: 'Location', width: 300 },
    { field: 'capacity', headerName: 'Capacity', width: 120, type: 'number' },
    { field: 'supervisor_id', headerName: 'Supervisor ID', width: 120, type: 'number' }
];

function HospitalDataGrid() {
    return (
        <GeneralDataGrid
            endpoint="/hospitals"
            columns={columns}
            title="Hospitals"
        />
    );
}

export default HospitalDataGrid;
