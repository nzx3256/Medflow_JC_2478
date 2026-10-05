import GeneralDataGrid from "./GeneralDataGrid";

const columns = [
    { field: 'equipment_model', headerName: 'Equipment Model', width: 300 },
    { field: 'reliability_ratio', headerName: 'Completed:Failed ratio', width: 200 },
];

function ReliabilityMetricsDataGrid() {
    return (
        <GeneralDataGrid
            columns={columns}
            endpoint="/equipment/reliability_metrics"
            title="Reliability Metrics"
            id='equipment_model'
        />
    );
}
export default ReliabilityMetricsDataGrid;
