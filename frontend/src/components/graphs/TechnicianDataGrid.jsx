import { useAuth } from "../../context/AuthContext.jsx"
import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'full_name', headerName: 'Full Name', width: 300, editable: true },
    { field: 'hospital_id', headerName: 'Hospital ID', width: 120, type: 'number', editable: true },
];

function TechnicianDataGrid() {
    const { user } = useAuth();
    return (
        <GeneralDataGrid
            endpoint="/technicians"
            title="Technicians"
            columns={columns}
            fullCRUD={user?.role == "Clinical Admin" ? true : false}
        />
    );
}

export default TechnicianDataGrid;
