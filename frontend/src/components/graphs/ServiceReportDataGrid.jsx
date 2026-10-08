import { useAuth } from "../../context/AuthContext.jsx"
import GeneralDataGrid from './GeneralDataGrid.jsx';

const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'notes', headerName: 'Notes', width: 400, type: 'longText', editable: true },
    {
        field: 'created_at', headerName: 'Creation Time', width: 220, editable: true,
        type: 'dateTime', valueGetter: (value) => value && new Date(value)
    },
    { field: 'work_order_id', headerName: 'Work Order ID', width: 200, type: 'number', editable: true },
];

function ServiceReportDataGrid() {
    const { user } = useAuth();
    return (
        <GeneralDataGrid
            endpoint="/service_reports"
            columns={columns}
            title="Service Reports"
            fullCRUD={(user?.role === "Clinical Admin" ||
                user?.role === "Field Technician") ? true : false}
        />
    );
}
export default ServiceReportDataGrid;
