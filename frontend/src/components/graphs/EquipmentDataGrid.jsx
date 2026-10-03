import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'serial_number', headerName: 'Serial Number', width: 200, type: 'string', editable: true },
    { field: 'model', headerName: 'Model', width: 200, type: 'string', editable: true },
    {
        field: 'status', headerName: 'Status', width: 200, editable: true, type: 'singleSelect',
        valueOptions: ["Available", "In-Use", "Maintenance", "Offline"]
    },
    { field: 'charge_level', headerName: 'Charge Level', width: 120, type: 'number', editable: true },
    { field: 'hospital_id', headerName: 'Hospital ID', width: 120, type: 'number', editable: true },
]

function EquipmentDataGrid() {
    return (
        <GeneralDataGrid
            endpoint="/equipment"
            title="Equipment"
            columns={columns}
        />
    );
}

export default EquipmentDataGrid;
