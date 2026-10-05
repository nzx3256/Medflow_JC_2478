import { useAuth } from "../../context/AuthContext";
import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'name', headerName: 'Name', width: 300, editable: true },
    { field: 'location_region', headerName: 'Location', width: 300, editable: true },
    { field: 'capacity', headerName: 'Capacity', width: 120, type: 'number', editable: true },
    { field: 'supervisor_id', headerName: 'Supervisor ID', width: 120, type: 'number', editable: true }
];

function HospitalDataGrid() {
    const { user } = useAuth();
    return (
        <GeneralDataGrid
            endpoint="/hospitals"
            columns={columns}
            title="Hospitals"
            fullCRUD={user?.role == "Clinical Admin" ? true : false}
        />
    );
}

export default HospitalDataGrid;
