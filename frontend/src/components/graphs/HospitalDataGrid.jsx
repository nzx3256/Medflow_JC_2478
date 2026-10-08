import { useAuth } from "../../context/AuthContext";
import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'name', headerName: 'Name', flex: 2, headerAlign: 'center', type: 'longText', editable: true },
    { field: 'location_region', headerName: 'Location', headerAlign: 'center', type: 'longText', flex: 2, editable: true },
    { field: 'capacity', headerName: 'Capacity', flex: 1, type: 'number', editable: true },
    { field: 'supervisor_id', headerName: 'Supervisor ID', flex: 1, type: 'number', editable: true }
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
