import { useAuth } from "../../context/AuthContext";
import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'title', headerName: 'Title', width: 320, editable: true },
    {
        field: 'priority', headerName: 'Priority', width: 150, editable: true, type: 'singleSelect',
        valueOptions: ["Low", "Medium", "Critical"]
    },
    {
        field: 'status', headerName: 'Status', width: 150, editable: true, type: 'singleSelect',
        valueOptions: ["Pending", "In-Progress", "Completed", "Failed"]
    },
    { field: 'equipment_id', headerName: 'Equipment ID', width: 120, type: 'number', editable: true },
    { field: 'technician_id', headerName: 'Technician ID', width: 120, type: 'number', editable: true },
];

function WorkOrderDataGrid() {
    const { user } = useAuth();
    return (
        <GeneralDataGrid
            columns={columns}
            title="Work Orders"
            endpoint="/work_orders"
            fullCRUD={user?.role == "Clinical Admin" ? true : false}
        />
    );
}
export default WorkOrderDataGrid;
