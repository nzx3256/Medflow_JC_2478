import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'full_name', headerName: 'Full Name', width: 300 },
    { field: 'hospital_id', headerName: 'Hospital ID', width: 120, type: 'number' },
];

function TechnicianDataGrid() {
    return (
        <GeneralDataGrid
            endpoint="/technicians"
            title="Technicians"
            columns={columns}
        />
    );
}

export default TechnicianDataGrid;
